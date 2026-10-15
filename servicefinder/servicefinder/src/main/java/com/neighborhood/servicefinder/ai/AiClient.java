package com.neighborhood.servicefinder.ai; // TODO: change to your base package

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/** Thin client for the FastAPI AI service. Every method fails safe (never throws). */
@Component
public class AiClient {

    private final RestClient rest;

    public AiClient(@Value("${ai.service.url:http://localhost:8000}") String baseUrl) {
        SimpleClientHttpRequestFactory f = new SimpleClientHttpRequestFactory();
        f.setConnectTimeout(2000);
        f.setReadTimeout(5000);
        this.rest = RestClient.builder().baseUrl(baseUrl).requestFactory(f).build();
    }

    public record SearchHit(Long id, double score) {}
    public record SearchResponse(List<SearchHit> results) {}
    public record ReviewAnalysis(String sentiment, double score, List<String> aspects, boolean flagged) {}

    public Optional<List<SearchHit>> search(String query, int topK) {
        try {
            SearchResponse res = rest.post().uri("/search")
                    .body(Map.of("query", query, "top_k", topK))
                    .retrieve().body(SearchResponse.class);
            return Optional.ofNullable(res).map(SearchResponse::results);
        } catch (Exception e) {
            return Optional.empty(); // caller falls back to keyword search
        }
    }

    public Optional<ReviewAnalysis> analyzeReview(String text) {
        try {
            return Optional.ofNullable(rest.post().uri("/review/analyze")
                    .body(Map.of("text", text == null ? "" : text))
                    .retrieve().body(ReviewAnalysis.class));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public boolean reindex(List<Map<String, Object>> services) {
        try {
            rest.post().uri("/index").body(Map.of("services", services))
                    .retrieve().toBodilessEntity();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    /** Sends raw booking/review rows to the AI service, which returns computed analytics. */
    public Optional<Map<String, Object>> analytics(Map<String, Object> payload) {
        try {
            Map<String, Object> res = rest.post().uri("/analytics")
                    .body(payload)
                    .retrieve()
                    .body(new ParameterizedTypeReference<Map<String, Object>>() {});
            return Optional.ofNullable(res);
        } catch (Exception e) {
            System.err.println("AI analytics failed: " + e);
            return Optional.empty();
        }
    }
}
