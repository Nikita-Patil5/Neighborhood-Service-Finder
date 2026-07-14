package com.neighborhood.servicefinder.dto;

import com.neighborhood.servicefinder.model.Review;
import com.neighborhood.servicefinder.model.User;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ReviewResponseDTO {
    private Long id;
    private String userName;
    private String providerName;
    private String providerPhone;
    private String providerAddress;
    private int rating;
    private String comment;
    private String  createdAt;
    private String serviceName;
    private Long serviceId;  
    
    public ReviewResponseDTO(Review review) {
        this.id = review.getId();
        this.userName = review.getUser().getName();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.serviceId = review.getService().getId();
        this.serviceName = review.getService().getName();
        
     // ✅ format date
        LocalDateTime date = review.getCreatedAt();
        if (date != null) {
            this.createdAt = date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        }

        // ✅ Get provider details from service
        User provider = review.getService().getProvider();
        if (provider != null) {
            this.providerName = provider.getName();
            this.providerPhone = provider.getPhoneNumber();  // make sure User entity has getPhoneNumber()
            this.providerAddress = provider.getAddress();    // make sure User entity has getAddress()
        }
    }

    // Getters & Setters
    public Long getId() { return id; }
    public String getUserName() { return userName; }
    public String getProviderName() { return providerName; }
    public String getProviderPhone() { return providerPhone; }
    public String getProviderAddress() { return providerAddress; }
    public int getRating() { return rating; }
    public String getComment() { return comment; }
    public String getCreatedAt() { return createdAt; }
    public String getServiceName() { return serviceName; }
    public Long getServiceId() { return serviceId; }

    public void setProviderName(String providerName) { this.providerName = providerName; }
    public void setProviderPhone(String providerPhone) { this.providerPhone = providerPhone; }
    public void setProviderAddress(String providerAddress) { this.providerAddress = providerAddress; }
}
