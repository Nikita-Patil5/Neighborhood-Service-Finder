package com.neighborhood.servicefinder.dto;

import com.neighborhood.servicefinder.model.Review;

import java.util.*;
import java.util.stream.Collectors;

public class ServiceInsightDTO {
    private Long serviceId;
    private String serviceName;
    private int totalReviews;
    private int analyzedReviews;
    private int positive;
    private int neutral;
    private int negative;
    private int positivePercent;
    private double averageRating;
    private List<String> praised = new ArrayList<>();
    private List<String> criticized = new ArrayList<>();

    public static ServiceInsightDTO from(Long serviceId, String serviceName, List<Review> reviews) {
        ServiceInsightDTO d = new ServiceInsightDTO();
        d.serviceId = serviceId;
        d.serviceName = serviceName;
        d.totalReviews = reviews.size();
        d.averageRating = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);

        Map<String, int[]> aspectCounts = new HashMap<>(); // [positiveCount, negativeCount]

        for (Review r : reviews) {
            String s = r.getSentiment();
            if (s == null) continue; // older reviews without AI analysis
            d.analyzedReviews++;
            switch (s) {
                case "positive" -> d.positive++;
                case "negative" -> d.negative++;
                default -> d.neutral++;
            }
            if (r.getAspects() != null && !r.getAspects().isBlank()) {
                for (String pair : r.getAspects().split(",")) {
                    String[] p = pair.split(":");
                    if (p.length != 2) continue;
                    int[] c = aspectCounts.computeIfAbsent(p[0].trim(), k -> new int[2]);
                    if ("positive".equals(p[1].trim())) c[0]++;
                    else if ("negative".equals(p[1].trim())) c[1]++;
                }
            }
        }

        d.positivePercent = d.analyzedReviews == 0 ? 0
                : (int) Math.round(100.0 * d.positive / d.analyzedReviews);

        d.praised = aspectCounts.entrySet().stream()
                .filter(e -> e.getValue()[0] > e.getValue()[1])
                .sorted((a, b) -> b.getValue()[0] - a.getValue()[0])
                .limit(3).map(Map.Entry::getKey).collect(Collectors.toList());

        d.criticized = aspectCounts.entrySet().stream()
                .filter(e -> e.getValue()[1] > e.getValue()[0])
                .sorted((a, b) -> b.getValue()[1] - a.getValue()[1])
                .limit(3).map(Map.Entry::getKey).collect(Collectors.toList());

        return d;
    }

    public Long getServiceId() { return serviceId; }
    public String getServiceName() { return serviceName; }
    public int getTotalReviews() { return totalReviews; }
    public int getAnalyzedReviews() { return analyzedReviews; }
    public int getPositive() { return positive; }
    public int getNeutral() { return neutral; }
    public int getNegative() { return negative; }
    public int getPositivePercent() { return positivePercent; }
    public double getAverageRating() { return averageRating; }
    public List<String> getPraised() { return praised; }
    public List<String> getCriticized() { return criticized; }
}