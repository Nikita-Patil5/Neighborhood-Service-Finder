package com.neighborhood.servicefinder.ai;

import com.neighborhood.servicefinder.model.Service;
import com.neighborhood.servicefinder.repository.ServiceRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class AiIndexer {

    private final AiClient ai;
    private final ServiceRepository repo;

    public AiIndexer(AiClient ai, ServiceRepository repo) {
        this.ai = ai;
        this.repo = repo;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() { reindex(); }

    @Async  // needs @EnableAsync on your main class; delete this line if you'd rather not
    public void reindex() {
        List<Map<String, Object>> payload = new ArrayList<>();
        for (Service s : repo.findAll()) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", s.getId());
            m.put("name", str(s.getName()));            // adjust getters to your entity
            m.put("category", str(s.getCategory()));
            m.put("description", str(s.getDescription()));
            payload.add(m);
        }
        ai.reindex(payload);
    }

    private static String str(Object v) { return v == null ? "" : String.valueOf(v); }
}