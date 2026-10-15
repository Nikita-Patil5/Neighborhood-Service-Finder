package com.neighborhood.servicefinder.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.neighborhood.servicefinder.model.Review;

class ServiceInsightDTOTest {

    private static Review review(String sentiment, String aspects, int rating) {
        Review r = new Review();
        r.setSentiment(sentiment);
        r.setAspects(aspects);
        r.setRating(rating);
        return r;
    }

    @Test
    void countsSentimentsAndIgnoresUnanalysedReviewsInThePercentage() {
        var dto = ServiceInsightDTO.from(1L, "Plumbing", List.of(
                review("positive", null, 5),
                review("positive", null, 4),
                review("negative", null, 1),
                review(null, null, 3)));          // old review, no AI analysis

        assertThat(dto.getTotalReviews()).isEqualTo(4);
        assertThat(dto.getAnalyzedReviews()).isEqualTo(3);
        assertThat(dto.getPositive()).isEqualTo(2);
        assertThat(dto.getNegative()).isEqualTo(1);
        assertThat(dto.getPositivePercent()).isEqualTo(67);
        assertThat(dto.getAverageRating()).isEqualTo(3.25);
    }

    @Test
    void separatesPraisedAndCriticizedAspects() {
        var dto = ServiceInsightDTO.from(1L, "Plumbing", List.of(
                review("positive", "quality:positive,price:positive", 5),
                review("positive", "quality:positive,punctuality:negative", 4),
                review("negative", "punctuality:negative,price:negative", 2)));

        assertThat(dto.getPraised()).containsExactly("quality");
        assertThat(dto.getCriticized()).containsExactly("punctuality");
        // price is 1 positive vs 1 negative, so it appears in neither list
    }

    @Test
    void handlesServicesWithNoReviews() {
        var dto = ServiceInsightDTO.from(1L, "Plumbing", List.of());

        assertThat(dto.getTotalReviews()).isZero();
        assertThat(dto.getPositivePercent()).isZero();
        assertThat(dto.getAverageRating()).isZero();
        assertThat(dto.getPraised()).isEmpty();
    }
}
