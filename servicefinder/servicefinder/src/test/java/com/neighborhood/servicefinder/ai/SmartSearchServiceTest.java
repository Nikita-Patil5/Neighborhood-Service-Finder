package com.neighborhood.servicefinder.ai;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
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

import com.neighborhood.servicefinder.model.Service;
import com.neighborhood.servicefinder.repository.ServiceRepository;

@ExtendWith(MockitoExtension.class)
class SmartSearchServiceTest {

    @Mock AiClient ai;
    @Mock ServiceRepository repo;
    @InjectMocks SmartSearchService smartSearch;

    private static Service service(long id, String name) {
        Service s = new Service();
        s.setId(id);
        s.setName(name);
        return s;
    }

    @Test
    void usesAiRankingOrderNotDatabaseOrder() {
        Service plumbing = service(1L, "Plumbing");
        Service electrician = service(2L, "Electrician");

        when(ai.search("tap leaking", 10)).thenReturn(Optional.of(List.of(
                new AiClient.SearchHit(2L, 0.91), new AiClient.SearchHit(1L, 0.55))));
        // the database returns them in a different order than the AI ranked them
        when(repo.findAllById(List.of(2L, 1L))).thenReturn(List.of(plumbing, electrician));

        var result = smartSearch.search("tap leaking", 10);

        assertThat(result.mode()).isEqualTo("ai");
        assertThat(result.services()).extracting(Service::getId).containsExactly(2L, 1L);
    }

    @Test
    void fallsBackToKeywordSearchWhenAiServiceIsDown() {
        Service plumbing = service(1L, "Plumbing");
        when(ai.search("plumber", 5)).thenReturn(Optional.empty());
        when(repo.searchByKeyword("plumber")).thenReturn(List.of(plumbing));

        var result = smartSearch.search("plumber", 5);

        assertThat(result.mode()).isEqualTo("keyword");
        assertThat(result.services()).containsExactly(plumbing);
        verify(repo, never()).findAllById(any());
    }

    @Test
    void skipsIdsThatNoLongerExistInTheDatabase() {
        Service plumbing = service(1L, "Plumbing");
        // the AI index is stale: service 99 was deleted after the last re-index
        when(ai.search("pipe", 10)).thenReturn(Optional.of(List.of(
                new AiClient.SearchHit(99L, 0.8), new AiClient.SearchHit(1L, 0.7))));
        when(repo.findAllById(List.of(99L, 1L))).thenReturn(List.of(plumbing));

        var result = smartSearch.search("pipe", 10);

        assertThat(result.mode()).isEqualTo("ai");
        assertThat(result.services()).extracting(Service::getId).containsExactly(1L);
    }
}
