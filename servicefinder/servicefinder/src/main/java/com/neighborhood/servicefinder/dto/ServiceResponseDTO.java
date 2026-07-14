package com.neighborhood.servicefinder.dto;

import com.neighborhood.servicefinder.model.Service;
import com.neighborhood.servicefinder.model.Review;
import com.neighborhood.servicefinder.repository.ReviewRepository;

import java.util.List;

public class ServiceResponseDTO {

    private Long id;
    private String name;
    private String category;
    private String description;
    private Double price;
    private String providerName;
    private Long providerId;
    private String providerPhoneNumber;
    private String providerAddress;

    private Double averageRating;
    private int totalReviews;

    public ServiceResponseDTO(Service service, ReviewRepository reviewRepository) {
        this.id = service.getId();
        this.name = service.getName();
        this.category = service.getCategory();
        this.description = service.getDescription();
        this.price = service.getPrice();
        this.providerId = service.getProvider().getId();
        this.providerName = service.getProvider().getName();
        this.providerPhoneNumber = service.getProvider().getPhoneNumber();
        this.providerAddress = service.getProvider().getAddress();


        List<Review> serviceReviews = reviewRepository.findByService(service);
        this.totalReviews = serviceReviews.size();
        this.averageRating = serviceReviews.isEmpty() ? 0.0 :
                serviceReviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public String getDescription() { return description; }
    public Double getPrice() { return price; }
    public String getProviderName() { return providerName; }
    public Long getProviderId() { return providerId; }
    public String getProviderPhoneNumber() { return providerPhoneNumber; } // ✅
    public String getProviderAddress() { return providerAddress; } // ✅
    public Double getAverageRating() { return averageRating; }
    public int getTotalReviews() { return totalReviews; }
}
