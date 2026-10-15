package com.neighborhood.servicefinder.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.neighborhood.servicefinder.ai.AiClient;
import com.neighborhood.servicefinder.model.Review;
import com.neighborhood.servicefinder.repository.ReviewRepository;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock ReviewRepository reviewRepository;
    @Mock AiClient aiClient;
    @InjectMocks ReviewService reviewService;

    private static Review reviewWith(String comment) {
        Review r = new Review();
        r.setRating(4);
        r.setComment(comment);
        return r;
    }

    @Test
    void storesSentimentAspectsAndFlagFromAi() {
        Review review = reviewWith("Very polite and on time");
        when(aiClient.analyzeReview("Very polite and on time")).thenReturn(Optional.of(
                new AiClient.ReviewAnalysis("positive", 0.98,
                        List.of("punctuality:positive", "behavior:positive"), false)));
        when(reviewRepository.save(any(Review.class))).thenAnswer(inv -> inv.getArgument(0));

        Review saved = reviewService.addReview(review);

        assertThat(saved.getSentiment()).isEqualTo("positive");
        assertThat(saved.getSentimentScore()).isEqualTo(0.98);
        assertThat(saved.getAspects()).isEqualTo("punctuality:positive,behavior:positive");
        assertThat(saved.getFlagged()).isFalse();
    }

    @Test
    void flagsReviewsTheAiMarksAsSpam() {
        Review review = reviewWith("visit www.cheapdeals.com now!!!");
        when(aiClient.analyzeReview(any())).thenReturn(Optional.of(
                new AiClient.ReviewAnalysis("positive", 0.9, List.of(), true)));
        when(reviewRepository.save(any(Review.class))).thenAnswer(inv -> inv.getArgument(0));

        assertThat(reviewService.addReview(review).getFlagged()).isTrue();
    }

    @Test
    void stillSavesTheReviewWhenAiServiceIsDown() {
        Review review = reviewWith("Good work");
        when(aiClient.analyzeReview(any())).thenReturn(Optional.empty());
        when(reviewRepository.save(any(Review.class))).thenAnswer(inv -> inv.getArgument(0));

        Review saved = reviewService.addReview(review);

        verify(reviewRepository).save(review);
        assertThat(saved.getSentiment()).isNull();
        assertThat(saved.getAspects()).isNull();
    }
}
