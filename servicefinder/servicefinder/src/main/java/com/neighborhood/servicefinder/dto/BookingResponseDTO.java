//////package com.neighborhood.servicefinder.dto;
//////
//////import java.time.LocalDate;
//////import java.time.LocalTime;
//////
//////import lombok.Data;
//////
//////@Data
//////public class BookingResponseDTO {
//////
//////    private Long id;
//////    private String serviceName;
//////    private String providerName;
//////    private String userName;
//////    private LocalDate date;
//////    private LocalTime startTime;
//////    private LocalTime endTime;
//////    private Double price;
//////    private String status;
//////    private String customerAddress;
//////    private String providerPhone;
//////    
//////    
//////	public String getCustomerAddress() {
//////		return customerAddress;
//////	}
//////	public void setCustomerAddress(String customerAddress) {
//////		this.customerAddress = customerAddress;
//////	}
//////	public String getProviderPhone() {
//////		return providerPhone;
//////	}
//////	public void setProviderPhone(String providerPhone) {
//////		this.providerPhone = providerPhone;
//////	}
//////	public Long getId() {
//////		return id;
//////	}
//////	public void setId(Long id) {
//////		this.id = id;
//////	}
//////	public String getServiceName() {
//////		return serviceName;
//////	}
//////	public void setServiceName(String serviceName) {
//////		this.serviceName = serviceName;
//////	}
//////	public String getProviderName() {
//////		return providerName;
//////	}
//////	public void setProviderName(String providerName) {
//////		this.providerName = providerName;
//////	}
//////	public String getUserName() {
//////		return userName;
//////	}
//////	public void setUserName(String userName) {
//////		this.userName = userName;
//////	}
//////	public LocalDate getDate() {
//////		return date;
//////	}
//////	public void setDate(LocalDate date) {
//////		this.date = date;
//////	}
//////	public LocalTime getStartTime() {
//////		return startTime;
//////	}
//////	public void setStartTime(LocalTime startTime) {
//////		this.startTime = startTime;
//////	}
//////	public LocalTime getEndTime() {
//////		return endTime;
//////	}
//////	public void setEndTime(LocalTime endTime) {
//////		this.endTime = endTime;
//////	}
//////	public Double getPrice() {
//////		return price;
//////	}
//////	public void setPrice(Double price) {
//////		this.price = price;
//////	}
//////	public String getStatus() {
//////		return status;
//////	}
//////	public void setStatus(String status) {
//////		this.status = status;
//////	}
//////    
//////    
//////
//////}
////
////package com.neighborhood.servicefinder.dto;
////
////import java.time.LocalDate;
////import java.time.LocalTime;
////
////import com.neighborhood.servicefinder.model.Booking;
////
////public class BookingResponseDTO {
////    private Long id;
////    private Long serviceId; // <-- add this
////    private String serviceName;
////    private String providerName;
////    private String userName;
////    private LocalDate date;
////    private LocalTime startTime;
////    private LocalTime endTime;
////    private String status;
////    private Double price;
////    private String phoneNumber;
////    private String address;
////    
////    public BookingResponseDTO() {
////        // default constructor
////    }
////
////    public BookingResponseDTO(Booking booking) {
////        this.id = booking.getId();
////        this.serviceId = booking.getService().getId(); // <-- add this
////        this.serviceName = booking.getService().getName();
////        this.providerName = booking.getService().getProvider().getName();
////        this.userName = booking.getUser().getName();
////        this.date = booking.getDate();
////        this.startTime = booking.getStartTime();
////        this.endTime = booking.getEndTime();
////        this.status = booking.getStatus();
////        this.price = booking.getService().getPrice();
////        this.phoneNumber = booking.getService().getProvider().getPhoneNumber();
////        this.address = booking.getService().getProvider().getAddress();
////    }
////
////	public Long getId() {
////		return id;
////	}
////
////	public void setId(Long id) {
////		this.id = id;
////	}
////
////	public Long getServiceId() {
////		return serviceId;
////	}
////
////	public void setServiceId(Long serviceId) {
////		this.serviceId = serviceId;
////	}
////
////	public String getServiceName() {
////		return serviceName;
////	}
////
////	public void setServiceName(String serviceName) {
////		this.serviceName = serviceName;
////	}
////
////	public String getProviderName() {
////		return providerName;
////	}
////
////	public void setProviderName(String providerName) {
////		this.providerName = providerName;
////	}
////
////	public String getUserName() {
////		return userName;
////	}
////
////	public void setUserName(String userName) {
////		this.userName = userName;
////	}
////
////	public LocalDate getDate() {
////		return date;
////	}
////
////	public void setDate(LocalDate date) {
////		this.date = date;
////	}
////
////	public LocalTime getStartTime() {
////		return startTime;
////	}
////
////	public void setStartTime(LocalTime startTime) {
////		this.startTime = startTime;
////	}
////
////	public LocalTime getEndTime() {
////		return endTime;
////	}
////
////	public void setEndTime(LocalTime endTime) {
////		this.endTime = endTime;
////	}
////
////	public String getStatus() {
////		return status;
////	}
////
////	public void setStatus(String status) {
////		this.status = status;
////	}
////
////	public Double getPrice() {
////		return price;
////	}
////
////	public void setPrice(Double price) {
////		this.price = price;
////	}
////
////	public String getPhoneNumber() {
////		return phoneNumber;
////	}
////
////	public void setPhoneNumber(String phoneNumber) {
////		this.phoneNumber = phoneNumber;
////	}
////
////	public String getAddress() {
////		return address;
////	}
////
////	public void setAddress(String address) {
////		this.address = address;
////	}
////
////    // getters and setters
////}
//
//package com.neighborhood.servicefinder.dto;
//
//import java.time.LocalDate;
//import java.time.LocalTime;
//
//import com.neighborhood.servicefinder.model.Booking; // Ensure this import is correct
//
//public class BookingResponseDTO {
//    private Long id;
//    private Long serviceId;
//    private String serviceName;
//    private String providerName;
//    private String userName;
//    private LocalDate date;
//    private LocalTime startTime;
//    private LocalTime endTime;
//    private String status;
//    private Double price;
//    private String providerPhoneNumber; // Provider's phone number
//    private String providerAddress;     // Provider's address
//    
//    
//	public String getProviderPhoneNumber() {
//		return providerPhoneNumber;
//	}
//
//	public void setProviderPhoneNumber(String providerPhoneNumber) {
//		this.providerPhoneNumber = providerPhoneNumber;
//	}
//
//	public String getProviderAddress() {
//		return providerAddress;
//	}
//
//	public void setProviderAddress(String providerAddress) {
//		this.providerAddress = providerAddress;
//	}
//
//	public String getUserPhoneNumber() {
//		return userPhoneNumber;
//	}
//
//	public void setUserPhoneNumber(String userPhoneNumber) {
//		this.userPhoneNumber = userPhoneNumber;
//	}
//
//	public String getUserAddress() {
//		return userAddress;
//	}
//
//	public void setUserAddress(String userAddress) {
//		this.userAddress = userAddress;
//	}
//	private String userPhoneNumber;
//	private String userAddress;
//    // --- NEW: Review details ---
//    private Integer rating; // Use Integer to allow null if no review
//    private String reviewComment; // Use String for comment, allow null
//
//
//    public BookingResponseDTO() {
//        // default constructor
//    }
//
//    public BookingResponseDTO(Booking booking) {
//        this.id = booking.getId();
//        this.serviceId = booking.getService().getId();
//        this.serviceName = booking.getService().getName();
//        this.providerName = booking.getService().getProvider().getName();
//        this.userName = booking.getUser().getName();
//        this.date = booking.getDate();
//        this.startTime = booking.getStartTime();
//        this.endTime = booking.getEndTime();
//        this.status = booking.getStatus();
//        this.price = booking.getPrice(); // Use booking.getPrice() as it might be specific to booking
//        this.providerPhoneNumber = booking.getProvider().getPhoneNumber();
//        this.providerAddress = booking.getProvider().getAddress();
//
//        // --- NEW: Map review data if present ---
//        if (booking.getReview() != null) {
//            this.rating = booking.getReview().getRating();
//            this.reviewComment = booking.getReview().getComment();
//        }
//    }
//
//    // --- Existing Getters and Setters ---
//    public Long getId() { return id; }
//    public void setId(Long id) { this.id = id; }
//    // ... (other getters and setters) ...
//    
//    // Make sure all these existing getters/setters are present
//    public Long getServiceId() { return serviceId; }
//    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
//
//    public String getServiceName() { return serviceName; }
//    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
//
//    public String getProviderName() { return providerName; }
//    public void setProviderName(String providerName) { this.providerName = providerName; }
//
//    public String getUserName() { return userName; }
//    public void setUserName(String userName) { this.userName = userName; }
//
//    public LocalDate getDate() { return date; }
//    public void setDate(LocalDate date) { this.date = date; }
//
//    public LocalTime getStartTime() { return startTime; }
//    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
//
//    public LocalTime getEndTime() { return endTime; }
//    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
//
//    public String getStatus() { return status; }
//    public void setStatus(String status) { this.status = status; }
//
//    public Double getPrice() { return price; }
//    public void setPrice(Double price) { this.price = price; }
//
//
//
//    // --- NEW: Getters and Setters for Review details ---
//    public Integer getRating() { return rating; }
//    public void setRating(Integer rating) { this.rating = rating; }
//
//    public String getReviewComment() { return reviewComment; }
//    public void setReviewComment(String reviewComment) { this.reviewComment = reviewComment; }
//}

package com.neighborhood.servicefinder.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.neighborhood.servicefinder.model.Booking;
import com.neighborhood.servicefinder.model.Review;

public class BookingResponseDTO {
    private Long id;
    private Long serviceId;
    private String serviceName;
    private Long providerId; 
    private String providerName;
    private String providerPhoneNumber;
    private String providerAddress;
    private Long userId; 
    private String userName;
    private String userPhoneNumber;
    private String userAddress;     
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status; // <-- This remains String
    private Double price;

    private Long reviewId;          
    private Integer rating;         
    private String reviewComment;   
    private boolean hasReview;      


    public BookingResponseDTO() {
        // default constructor
    }

    public BookingResponseDTO(Booking booking) {
        this.id = booking.getId();
        this.serviceId = booking.getService().getId();
        this.serviceName = booking.getService().getName();

        if (booking.getService() != null && booking.getService().getProvider() != null) {
            this.providerId = booking.getService().getProvider().getId();
            this.providerName = booking.getService().getProvider().getName();
            this.providerPhoneNumber = booking.getService().getProvider().getPhoneNumber();
            this.providerAddress = booking.getService().getProvider().getAddress();
        } else {
            this.providerId = null;
            this.providerName = "N/A";
            this.providerPhoneNumber = "N/A";
            this.providerAddress = "N/A";
        }

        if (booking.getUser() != null) {
            this.userId = booking.getUser().getId();
            this.userName = booking.getUser().getName();
            this.userPhoneNumber = booking.getUser().getPhoneNumber();
            this.userAddress = booking.getUser().getAddress();
        } else {
            this.userId = null;
            this.userName = "N/A";
            this.userPhoneNumber = "N/A";
            this.userAddress = "N/A";
        }
        
        this.date = booking.getDate();
        this.startTime = booking.getStartTime();
        this.endTime = booking.getEndTime();
        this.status = booking.getStatus(); // CORRECT: Assign directly as String
        this.price = booking.getPrice(); 

        if (booking.getReview() != null) {
            Review review = booking.getReview(); 
            this.reviewId = review.getId();
            this.rating = review.getRating();
            this.reviewComment = review.getComment();
            this.hasReview = true;
        } else {
            this.reviewId = null;
            this.rating = null;
            this.reviewComment = null;
            this.hasReview = false;
        }
    }

    // --- Getters and Setters (already correct for String status) ---
    // ... all existing getters and setters ...
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getProviderPhoneNumber() { return providerPhoneNumber; }
    public void setProviderPhoneNumber(String providerPhoneNumber) { this.providerPhoneNumber = providerPhoneNumber; }

    public String getProviderAddress() { return providerAddress; }
    public void setProviderAddress(String providerAddress) { this.providerAddress = providerAddress; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserPhoneNumber() { return userPhoneNumber; }
    public void setUserPhoneNumber(String userPhoneNumber) { this.userPhoneNumber = userPhoneNumber; }

    public String getUserAddress() { return userAddress; }
    public void setUserAddress(String userAddress) { this.userAddress = userAddress; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; } // <-- This setter
    
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public Long getReviewId() { return reviewId; }
    public void setReviewId(Long reviewId) { this.reviewId = reviewId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getReviewComment() { return reviewComment; }
    public void setReviewComment(String reviewComment) { this.reviewComment = reviewComment; }

    public boolean isHasReview() { return hasReview; }
    public void setHasReview(boolean hasReview) { this.hasReview = hasReview; }
}