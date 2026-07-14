package com.neighborhood.servicefinder.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

//public class ReviewRequestDTO {
//
//    @NotNull(message = "Service ID is required")
//    private Long serviceId;
//
//    @Min(value = 1, message = "Rating must be at least 1")
//    @Max(value = 5, message = "Rating cannot exceed 5")
//    private int rating;
//
//    @NotBlank(message = "Comment cannot be empty")
//    private String comment;
//
//    // Getters & Setters
//    public Long getServiceId() { return serviceId; }
//    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
//
//    public int getRating() { return rating; }
//    public void setRating(int rating) { this.rating = rating; }
//
//    public String getComment() { return comment; }
//    public void setComment(String comment) { this.comment = comment; }
//}

public class ReviewRequestDTO {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotNull(message = "Service ID is required")
    private Long serviceId;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private int rating;

    @NotBlank(message = "Comment cannot be empty")
    private String comment;

    // Getters & Setters
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
