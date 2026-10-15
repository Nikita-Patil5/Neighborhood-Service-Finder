package com.neighborhood.servicefinder.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neighborhood.servicefinder.ai.AiClient;
import com.neighborhood.servicefinder.model.Booking;
import com.neighborhood.servicefinder.model.Review;
import com.neighborhood.servicefinder.model.Service;
import com.neighborhood.servicefinder.repository.BookingRepository;
import com.neighborhood.servicefinder.repository.ReviewRepository;

/**
 * Admin analytics: collects raw rows from MySQL and lets the Python (pandas) service
 * compute KPIs, trends, rankings and the demand forecast.
 */
@RestController
@RequestMapping("/api/admin/analytics")
public class AnalyticsController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private AiClient aiClient;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<Object> getAnalytics() {

        List<Map<String, Object>> bookings = new ArrayList<>();
        for (Booking b : bookingRepository.findAll()) {
            Service s = b.getService();
            Map<String, Object> m = new HashMap<>();
            m.put("id", b.getId());
            m.put("date", dateString(b.getDate()));
            m.put("status", String.valueOf(b.getStatus()));
            m.put("category", s != null ? str(s.getCategory()) : "");
            m.put("service", s != null ? str(s.getName()) : "");
            // use the booking's own provider and price (price at the time of booking)
            m.put("provider", b.getProvider() != null ? str(b.getProvider().getName())
                    : (s != null && s.getProvider() != null) ? str(s.getProvider().getName()) : "");
            m.put("price", b.getPrice() != null ? b.getPrice()
                    : (s != null && s.getPrice() != null) ? s.getPrice() : 0.0);
            bookings.add(m);
        }

        List<Map<String, Object>> reviews = new ArrayList<>();
        for (Review r : reviewRepository.findAll()) {
            if (Boolean.TRUE.equals(r.getFlagged())) continue; // ignore suspected spam
            Service s = r.getService();
            Map<String, Object> m = new HashMap<>();
            m.put("rating", r.getRating());
            m.put("sentiment", r.getSentiment());               // may be null for old reviews
            m.put("provider", (s != null && s.getProvider() != null) ? str(s.getProvider().getName()) : "");
            m.put("service", s != null ? str(s.getName()) : "");
            reviews.add(m);
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("bookings", bookings);
        payload.put("reviews", reviews);

        Optional<Map<String, Object>> result = aiClient.analytics(payload);
        if (result.isPresent()) {
            return ResponseEntity.ok(result.get());
        }
        return ResponseEntity.status(503)
                .body(Map.of("message", "Analytics service is unavailable. Make sure the AI service is running."));
    }

    // "2026-10-07" or "2026-10-07T14:00" -> "2026-10-07" (works for LocalDate, LocalDateTime or String)
    private static String dateString(Object d) {
        if (d == null) return null;
        String s = String.valueOf(d);
        return s.length() >= 10 ? s.substring(0, 10) : s;
    }

    private static String str(Object v) {
        return v == null ? "" : String.valueOf(v);
    }
}