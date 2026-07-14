//package com.neighborhood.servicefinder.controller;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//import jakarta.validation.Valid;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.*;
//
//import com.neighborhood.servicefinder.dto.ReviewRequestDTO;
//import com.neighborhood.servicefinder.dto.ReviewResponseDTO;
//import com.neighborhood.servicefinder.exception.ResourceNotFoundException;
//import com.neighborhood.servicefinder.model.Review;
//import com.neighborhood.servicefinder.model.Service;
//import com.neighborhood.servicefinder.model.User;
//import com.neighborhood.servicefinder.repository.ReviewRepository;
//import com.neighborhood.servicefinder.repository.ServiceRepository;
//import com.neighborhood.servicefinder.repository.UserRepository;
//
//@RestController
//@RequestMapping("/api/reviews")
//public class ReviewController {
//
//    @Autowired
//    private ReviewRepository reviewRepository;
//
//    @Autowired
//    private ServiceRepository serviceRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    // ==============================
//    // User APIs
//    // ==============================
//
//    @PreAuthorize("hasRole('USER')")
//    @PostMapping("/addreview")
//    public ResponseEntity<ReviewResponseDTO> addReview(@Valid @RequestBody ReviewRequestDTO reviewRequest,
//                                                       Authentication authentication) {
//        User user = userRepository.findByEmail(authentication.getName())
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        Service service = serviceRepository.findById(reviewRequest.getServiceId())
//                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
//
//        Review review = new Review();
//        review.setUser(user);
//        review.setService(service);
//        review.setRating(reviewRequest.getRating());
//        review.setComment(reviewRequest.getComment());
//
//        Review savedReview = reviewRepository.save(review);
//        return ResponseEntity.ok(new ReviewResponseDTO(savedReview));
//    }
//
//    @PreAuthorize("hasRole('USER')")
//    @PutMapping("/{id}")
//    public ResponseEntity<ReviewResponseDTO> updateReview(@PathVariable Long id,
//                                                          @Valid @RequestBody ReviewRequestDTO reviewRequest,
//                                                          Authentication authentication) {
//        Review review = reviewRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
//
//        User user = userRepository.findByEmail(authentication.getName())
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        if (!review.getUser().getId().equals(user.getId())) {
//            return ResponseEntity.status(403).build();
//        }
//
//        review.setRating(reviewRequest.getRating());
//        review.setComment(reviewRequest.getComment());
//        Review updatedReview = reviewRepository.save(review);
//        return ResponseEntity.ok(new ReviewResponseDTO(updatedReview));
//    }
//
//    @PreAuthorize("hasRole('USER')")
//    @DeleteMapping("/{id}")
//    public ResponseEntity<String> deleteReview(@PathVariable Long id, Authentication authentication) {
//        Review review = reviewRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
//
//        User user = userRepository.findByEmail(authentication.getName())
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        if (!review.getUser().getId().equals(user.getId())) {
//            return ResponseEntity.status(403).body("You can delete only your own reviews");
//        }
//
//        reviewRepository.delete(review);
//        return ResponseEntity.ok("Review deleted successfully");
//    }
//
//    // ==============================
//    // Provider APIs (read-only)
//    // ==============================
//
//    @PreAuthorize("hasAnyRole('PROVIDER','USER','ADMIN')")
//    @GetMapping("/service/{serviceId}")
//    public ResponseEntity<List<ReviewResponseDTO>> getReviewsForService(@PathVariable Long serviceId) {
//        Service service = serviceRepository.findById(serviceId)
//                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
//
//        List<Review> reviews = reviewRepository.findByService(service);
//        List<ReviewResponseDTO> response = reviews.stream()
//                .map(ReviewResponseDTO::new)
//                .collect(Collectors.toList());
//        return ResponseEntity.ok(response);
//    }
//
//    // ==============================
//    // Admin APIs
//    // ==============================
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/all")
//    public ResponseEntity<List<ReviewResponseDTO>> getAllReviews() {
//        List<Review> reviews = reviewRepository.findAll();
//        List<ReviewResponseDTO> response = reviews.stream()
//                .map(ReviewResponseDTO::new)
//                .collect(Collectors.toList());
//        return ResponseEntity.ok(response);
//    }
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @DeleteMapping("/admin/{id}")
//    public ResponseEntity<String> adminDeleteReview(@PathVariable Long id) {
//        Review review = reviewRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
//
//        reviewRepository.delete(review);
//        return ResponseEntity.ok("Review deleted successfully by admin");
//    }
//}
//


package com.neighborhood.servicefinder.controller;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.neighborhood.servicefinder.dto.ReviewRequestDTO;
import com.neighborhood.servicefinder.dto.ReviewResponseDTO;
import com.neighborhood.servicefinder.dto.ReviewUpdateDTO;
import com.neighborhood.servicefinder.exception.ResourceNotFoundException;
import com.neighborhood.servicefinder.model.Booking;
import com.neighborhood.servicefinder.model.Review;
import com.neighborhood.servicefinder.model.Service;
import com.neighborhood.servicefinder.model.User;
import com.neighborhood.servicefinder.repository.BookingRepository;
import com.neighborhood.servicefinder.repository.ReviewRepository;
import com.neighborhood.servicefinder.repository.ServiceRepository;
import com.neighborhood.servicefinder.repository.UserRepository;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private BookingRepository bookingRepository;

    
    @Autowired
    private UserRepository userRepository;

    // ==============================
    // User APIs
    // ==============================

//    @PreAuthorize("hasRole('USER')")
//    @PostMapping
//    public ResponseEntity<ReviewResponseDTO> addReview(
//            @Valid @RequestBody ReviewRequestDTO reviewRequest,
//            Authentication authentication) {
//
//        User user = userRepository.findByEmail(authentication.getName())
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        Service service = serviceRepository.findById(reviewRequest.getServiceId())
//                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
//
//        Booking booking = bookingRepository.findById(reviewRequest.getBookingId())
//                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
//
//        // ✅ Ensure that this booking belongs to the same user and service
//        if (!booking.getUser().getId().equals(user.getId())) {
//            throw new IllegalArgumentException("You can only review your own bookings.");
//        }
//        if (!booking.getService().getId().equals(service.getId())) {
//            throw new IllegalArgumentException("This booking does not match the selected service.");
//        }
//
//        // ✅ Prevent duplicate review per booking
//        if (reviewRepository.existsByBookingId(booking.getId())) {
//            throw new IllegalArgumentException("You already reviewed this booking.");
//        }
//
//        Review review = new Review(booking, user, service,
//                                   reviewRequest.getRating(),
//                                   reviewRequest.getComment());
//
//        Review savedReview = reviewRepository.save(review);
//        return ResponseEntity.ok(new ReviewResponseDTO(savedReview));
//    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ReviewResponseDTO> addReview(@Valid @RequestBody ReviewRequestDTO reviewRequest,
                                                       Authentication authentication) {
        Booking booking = bookingRepository.findById(reviewRequest.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // ✅ Only allow review if booking status is DONE
        if (!booking.getStatus().equals("DONE")) {
            throw new IllegalArgumentException("You can only review a booking that has been completed (DONE).");
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Service service = booking.getService();

        Review review = new Review(booking, user, service,
                                   reviewRequest.getRating(),
                                   reviewRequest.getComment());

        Review saved = reviewRepository.save(review);
        return ResponseEntity.ok(new ReviewResponseDTO(saved));
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/my") // NEW ENDPOINT: Get reviews by the current user
    public ResponseEntity<List<ReviewResponseDTO>> getUserReviews(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Review> reviews = reviewRepository.findByUser(user);
        List<ReviewResponseDTO> response = reviews.stream()
                .map(ReviewResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

//    @PreAuthorize("hasRole('USER')")
//    @PutMapping("/{id}")
//    public ResponseEntity<ReviewResponseDTO> updateReview(@PathVariable Long id,
//                                                          @Valid @RequestBody ReviewRequestDTO reviewRequest,
//                                                          Authentication authentication) {
//        Review review = reviewRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));
//
//        User user = userRepository.findByEmail(authentication.getName())
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        if (!review.getUser().getId().equals(user.getId())) {
//            return ResponseEntity.status(403).build(); // Forbidden
//        }
//
//        // Optional: If serviceId is provided in request and it's different,
//        // you might allow changing the service, but usually reviews are tied to one service.
//        // For simplicity, we'll assume serviceId cannot be changed on update.
//        // If it was provided in DTO, it would be ignored or validated.
//
//        review.setRating(reviewRequest.getRating());
//        review.setComment(reviewRequest.getComment());
//        Review updatedReview = reviewRepository.save(review);
//        return ResponseEntity.ok(new ReviewResponseDTO(updatedReview));
//    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponseDTO> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewUpdateDTO reviewRequest,
            Authentication authentication) {

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        // ✅ Only update rating & comment, keep booking & service intact
        review.setRating(reviewRequest.getRating());
        review.setComment(reviewRequest.getComment());

        Review updatedReview = reviewRepository.save(review);
        return ResponseEntity.ok(new ReviewResponseDTO(updatedReview));
    }


    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable Long id, Authentication authentication) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!review.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You can delete only your own reviews");
        }

        reviewRepository.delete(review);
        return ResponseEntity.ok("Review deleted successfully");
    }

    // ==============================
    // Public/Shared APIs (read-only)
    // ==============================

    @PreAuthorize("hasAnyRole('PROVIDER','USER','ADMIN')") // Changed to include USER as well
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsForService(@PathVariable Long serviceId) {
        Service service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        List<Review> reviews = reviewRepository.findByService(service);
        List<ReviewResponseDTO> response = reviews.stream()
                .map(ReviewResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ==============================
    // Admin APIs
    // ==============================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<ReviewResponseDTO>> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        List<ReviewResponseDTO> response = reviews.stream()
                .map(ReviewResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<String> adminDeleteReview(@PathVariable Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        reviewRepository.delete(review);
        return ResponseEntity.ok("Review deleted successfully by admin");
    }
}