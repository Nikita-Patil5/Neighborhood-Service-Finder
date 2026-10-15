package com.neighborhood.servicefinder.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import com.neighborhood.servicefinder.ai.AiClient;
import com.neighborhood.servicefinder.dto.ReviewRequestDTO;
import com.neighborhood.servicefinder.model.Booking;
import com.neighborhood.servicefinder.model.Review;
import com.neighborhood.servicefinder.model.Service;
import com.neighborhood.servicefinder.model.User;
import com.neighborhood.servicefinder.repository.BookingRepository;
import com.neighborhood.servicefinder.repository.ReviewRepository;
import com.neighborhood.servicefinder.repository.ServiceRepository;
import com.neighborhood.servicefinder.repository.UserRepository;

/** Tests for the business rules that used to live in ReviewController. */
@ExtendWith(MockitoExtension.class)
class ReviewServiceRulesTest {

    @Mock ReviewRepository reviewRepository;
    @Mock AiClient aiClient;
    @Mock BookingRepository bookingRepository;
    @Mock UserRepository userRepository;
    @Mock ServiceRepository serviceRepository;
    @InjectMocks ReviewService reviewService;

    private static User user(long id) {
        User u = new User();
        u.setId(id);
        return u;
    }

    private static Booking booking(String status, User owner) {
        Booking b = new Booking();
        b.setId(5L);
        b.setStatus(status);
        b.setUser(owner);
        b.setService(new Service());
        return b;
    }

    private static ReviewRequestDTO request(long bookingId) {
        ReviewRequestDTO req = mock(ReviewRequestDTO.class);
        when(req.getBookingId()).thenReturn(bookingId);
        return req;
    }

    // ---------- creating a review ----------

    @Test
    void rejectsReviewForABookingThatIsNotDone() {
        when(bookingRepository.findById(5L)).thenReturn(Optional.of(booking("PENDING", user(1))));

        assertThatThrownBy(() -> reviewService.createReview(request(5L), "a@x.com"))
                .isInstanceOf(IllegalArgumentException.class);
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void rejectsReviewForAnotherUsersBooking() {
        when(bookingRepository.findById(5L)).thenReturn(Optional.of(booking("DONE", user(1))));
        when(userRepository.findByEmail("b@x.com")).thenReturn(Optional.of(user(2)));

        assertThatThrownBy(() -> reviewService.createReview(request(5L), "b@x.com"))
                .isInstanceOf(AccessDeniedException.class);
        verify(reviewRepository, never()).save(any(Review.class));
    }

    @Test
    void savesReviewWithAiAnalysisForTheBookingOwner() {
        User owner = user(1);
        when(bookingRepository.findById(5L)).thenReturn(Optional.of(booking("DONE", owner)));
        when(userRepository.findByEmail("a@x.com")).thenReturn(Optional.of(owner));
        when(aiClient.analyzeReview(any())).thenReturn(Optional.of(
                new AiClient.ReviewAnalysis("positive", 0.97, List.of("quality:positive"), false)));
        when(reviewRepository.save(any(Review.class))).thenAnswer(inv -> inv.getArgument(0));

        ReviewRequestDTO req = request(5L);
        when(req.getRating()).thenReturn(5);
        when(req.getComment()).thenReturn("Great work");

        Review saved = reviewService.createReview(req, "a@x.com");

        assertThat(saved.getRating()).isEqualTo(5);
        assertThat(saved.getSentiment()).isEqualTo("positive");
        assertThat(saved.getAspects()).isEqualTo("quality:positive");
    }

    // ---------- deleting ----------

    @Test
    void userCannotDeleteSomeoneElsesReview() {
        Review review = new Review();
        review.setUser(user(1));
        when(reviewRepository.findById(9L)).thenReturn(Optional.of(review));
        when(userRepository.findByEmail("b@x.com")).thenReturn(Optional.of(user(2)));

        assertThatThrownBy(() -> reviewService.deleteReview(9L, "b@x.com"))
                .isInstanceOf(AccessDeniedException.class);
        verify(reviewRepository, never()).delete(any(Review.class));
    }

    @Test
    void ownerCanDeleteTheirOwnReview() {
        User owner = user(1);
        Review review = new Review();
        review.setUser(owner);
        when(reviewRepository.findById(9L)).thenReturn(Optional.of(review));
        when(userRepository.findByEmail("a@x.com")).thenReturn(Optional.of(owner));

        reviewService.deleteReview(9L, "a@x.com");

        verify(reviewRepository).delete(review);
    }

    // ---------- moderation ----------

    @Test
    void approvingAFlaggedReviewClearsTheFlag() {
        Review review = new Review();
        review.setFlagged(true);
        when(reviewRepository.findById(3L)).thenReturn(Optional.of(review));
        when(reviewRepository.save(any(Review.class))).thenAnswer(inv -> inv.getArgument(0));

        reviewService.approveReview(3L);

        assertThat(review.getFlagged()).isFalse();
        verify(reviewRepository).save(review);
    }
}
