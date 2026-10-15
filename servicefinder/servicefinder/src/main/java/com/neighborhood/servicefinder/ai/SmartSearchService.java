package com.neighborhood.servicefinder.ai;

import com.neighborhood.servicefinder.model.Service;
import com.neighborhood.servicefinder.repository.ServiceRepository;

import java.util.*;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class SmartSearchService {

    public record SmartSearchResult(String mode, List<Service> services) {}

    private final AiClient ai;
    private final ServiceRepository repo;

    public SmartSearchService(AiClient ai, ServiceRepository repo) {
        this.ai = ai;
        this.repo = repo;
        final SmartSearchService smartSearchService; // add to the constructor
    }

    public SmartSearchResult search(String q, int topK) {
        Optional<List<AiClient.SearchHit>> hits = ai.search(q, topK);

        if (hits.isPresent()) {
            List<Long> ids = hits.get().stream().map(AiClient.SearchHit::id).toList();
            Map<Long, Service> byId = repo.findAllById(ids).stream()
                    .collect(Collectors.toMap(Service::getId, s -> s));
            List<Service> ordered = ids.stream().map(byId::get).filter(Objects::nonNull).toList();
            return new SmartSearchResult("ai", ordered);
        }
        return new SmartSearchResult("keyword", repo.searchByKeyword(q));
    }
}