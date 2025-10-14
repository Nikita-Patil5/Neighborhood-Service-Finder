package com.neighborhood.servicefinder.dto;

import com.neighborhood.servicefinder.model.Service;

public class ServiceResponseDTO {

    private Long id;
    private String name;
    private String category;
    private String description;
    private Double price;
    private String providerName;
    private Long providerId;

    // Constructor mapping from Service entity
    public ServiceResponseDTO(Service service) {
        this.id = service.getId();
        this.name = service.getName();
        this.category = service.getCategory();
        this.description = service.getDescription();
        this.price = service.getPrice();
        this.providerId = service.getProvider().getId();
        this.providerName = service.getProvider().getName();
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public Double getPrice() {
        return price;
    }

    public String getProviderName() {
        return providerName;
    }

    public Long getProviderId() {
        return providerId;
    }
}
