//package com.neighborhood.servicefinder.service;
//
//import com.neighborhood.servicefinder.ai.AiClient;
//import com.neighborhood.servicefinder.service.ReviewService;
//import com.neighborhood.servicefinder.model.Review;
//import com.neighborhood.servicefinder.repository.ReviewRepository;
//
//@org.springframework.stereotype.Service   // full name because our entity is also called Service
//public class ReviewService {
//
//    
//    private final ReviewRepository reviewRepository;
//    private final AiClient aiClient;
//
//    public ReviewService(ReviewRepository reviewRepository, AiClient aiClient) {
//        this.reviewRepository = reviewRepository;
//        this.aiClient = aiClient;
//    }
//
//    public Review addReview(Review review) {
//        applyAiAnalysis(review);
//        return reviewRepository.save(review);
//    }
//
//    public Review updateReview(Long id, Review updated) {
//        Review existing = reviewRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Review not found"));
//        existing.setRating(updated.getRating());
//        existing.setComment(updated.getComment());
//        applyAiAnalysis(existing);
//        return reviewRepository.save(existing);
//    }
//
//    // ... keep your existing delete / get methods ...
//
//    private void applyAiAnalysis(Review review) {
//        var result = aiClient.analyzeReview(review.getComment());
//        if (result.isPresent()) {
//            var a = result.get();
//            review.setSentiment(a.sentiment());
//            review.setSentimentScore(a.score());
//            review.setAspects(String.join(",", a.aspects()));
//            review.setFlagged(a.flagged());
//        } else {
//            review.setSentiment(null);
//            review.setSentimentScore(null);
//            review.setAspects(null);
//        }
//    }
//}

package com.neighborhood.servicefinder.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.annotation.Transactional;

import com.neighborhood.servicefinder.ai.AiClient;
import com.neighborhood.servicefinder.dto.ReviewRequestDTO;
import com.neighborhood.servicefinder.dto.ReviewUpdateDTO;
import com.neighborhood.servicefinder.dto.ServiceInsightDTO;
import com.neighborhood.servicefinder.exception.ResourceNotFoundException;
import com.neighborhood.servicefinder.model.Booking;
import com.neighborhood.servicefinder.model.Review;
import com.neighborhood.servicefinder.model.Service;
import com.neighborhood.servicefinder.model.User;
import com.neighborhood.servicefinder.repository.BookingRepository;
import com.neighborhood.servicefinder.repository.ReviewRepository;
import com.neighborhood.servicefinder.repository.ServiceRepository;
import com.neighborhood.servicefinder.repository.UserRepository;

/**
 * All review business rules live here: who may review, who may edit or delete,
 * the AI analysis step, moderation and provider insights.
 */
@org.springframework.stereotype.Service   // full name because our entity is also called Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final AiClient aiClient;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         AiClient aiClient,
                         BookingRepository bookingRepository,
                         UserRepository userRepository,
                         ServiceRepository serviceRepository) {
        this.reviewRepository = reviewRepository;
        this.aiClient = aiClient;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.serviceRepository = serviceRepository;
    }

    // ==============================
    // Create / update (these run the AI analysis)
    // ==============================

    /** Runs the AI analysis, then saves. Also used by the demo data seeder. Saves even if the AI is down. */
    public Review addReview(Review review) {
        applyAiAnalysis(review);
        return reviewRepository.save(review);
    }

    /** Validates the rules for a new review, builds it and saves it. */
    public Review createReview(ReviewRequestDTO request, String userEmail) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // only completed bookings can be reviewed
        if (!"DONE".equals(booking.getStatus())) {
            throw new IllegalArgumentException("You can only review a booking that has been completed (DONE).");
        }

        User user = findUser(userEmail);
        if (!booking.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can only review your own bookings.");
        }

        // one review per booking
        if (booking.getReview() != null) {
            throw new IllegalArgumentException("You already reviewed this booking.");
        }

        Service service = booking.getService();
        Review review = new Review(booking, user, service, request.getRating(), request.getComment());
        return addReview(review);
    }

    /** Only the author can edit; the edited comment is analysed again. */
    public Review updateReview(Long id, ReviewUpdateDTO request, String userEmail) {
        Review review = findReview(id);
        User user = findUser(userEmail);

        if (!review.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can edit only your own reviews");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        return addReview(review);
    }

    // ==============================
    // Delete
    // ==============================

    public void deleteReview(Long id, String userEmail) {
        Review review = findReview(id);
        User user = findUser(userEmail);

        if (!review.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You can delete only your own reviews");
        }
        reviewRepository.delete(review);
    }

    public void adminDeleteReview(Long id) {
        reviewRepository.delete(findReview(id));
    }

    // ==============================
    // Read
    // ==============================

    @Transactional(readOnly = true)
    public List<Review> getMyReviews(String userEmail) {
        return reviewRepository.findByUser(findUser(userEmail));
    }

    /** Public list for a service: flagged (suspected spam) reviews are hidden. */
    @Transactional(readOnly = true)
    public List<Review> getVisibleReviewsForService(Long serviceId) {
        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        return reviewRepository.findVisibleByService(service);
    }

    @Transactional(readOnly = true)
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // ==============================
    // Moderation and insights
    // ==============================

    /** Admin decides a flagged review is not spam. */
    public void approveReview(Long id) {
        Review review = findReview(id);
        review.setFlagged(false);
        reviewRepository.save(review);
    }

    /** Sentiment summary per service for the logged-in provider (flagged reviews excluded). */
    @Transactional(readOnly = true)
    public List<ServiceInsightDTO> getProviderInsights(String providerEmail) {
        User provider = findUser(providerEmail);

        List<Review> visible = reviewRepository.findByServiceProvider(provider).stream()
                .filter(r -> !Boolean.TRUE.equals(r.getFlagged()))
                .collect(Collectors.toList());

        Map<Long, List<Review>> byService = visible.stream()
                .collect(Collectors.groupingBy(r -> r.getService().getId()));

        return byService.entrySet().stream()
                .map(e -> ServiceInsightDTO.from(
                        e.getKey(),
                        e.getValue().get(0).getService().getName(),
                        e.getValue()))
                .collect(Collectors.toList());
    }

    // ==============================
    // Helpers
    // ==============================

    private void applyAiAnalysis(Review review) {
        var result = aiClient.analyzeReview(review.getComment());
        if (result.isPresent()) {
            var a = result.get();
            review.setSentiment(a.sentiment());
            review.setSentimentScore(a.score());
            review.setAspects(String.join(",", a.aspects()));
            review.setFlagged(a.flagged());
        } else {
            // AI unavailable: clear stale analysis so an edited comment never keeps an old sentiment
            review.setSentiment(null);
            review.setSentimentScore(null);
            review.setAspects(null);
        }
    }

    private Review findReview(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}