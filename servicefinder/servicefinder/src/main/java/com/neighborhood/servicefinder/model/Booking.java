//package com.neighborhood.servicefinder.model;
//
//import java.time.LocalDate;
//import java.time.LocalTime;
//
//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
//import jakarta.persistence.*;
//
//@Entity
//@Table(name = "bookings")
//public class Booking {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    // Many bookings can belong to one user (customer)
//    @ManyToOne
//    @JoinColumn(name = "user_id", nullable = false)
//    @JsonIgnoreProperties({"bookings", "password", "services"})
//    private User user;
//
//    // Many bookings can be for one service
//    @ManyToOne
//    @JoinColumn(name = "service_id", nullable = false)
//    @JsonIgnoreProperties({"provider"})
//    private Service service;
//
//    // Provider of the service
//    @ManyToOne
//    @JoinColumn(name = "provider_id", nullable = false)
//    @JsonIgnoreProperties({"services", "password", "bookings"})
//    private User provider;
//
//    private LocalDate date;
//    private LocalTime startTime;
//    private LocalTime endTime;
//
//    private String status;   // Pending, Confirmed, Cancelled
//    private Double price;
//
//    // --- Getters and setters ---
//    public Long getId() { return id; }
//    public void setId(Long id) { this.id = id; }
//
//    public User getUser() { return user; }
//    public void setUser(User user) { this.user = user; }
//
//    public Service getService() { return service; }
//    public void setService(Service service) { this.service = service; }
//
//    public User getProvider() { return provider; }
//    public void setProvider(User provider) { this.provider = provider; }
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
//}

package com.neighborhood.servicefinder.model;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Changed to LAZY for efficiency
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"bookings", "password", "services", "reviews"}) // Add reviews to ignore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY) // Changed to LAZY for efficiency
    @JoinColumn(name = "service_id", nullable = false)
    @JsonIgnoreProperties({"provider", "reviews", "bookings"}) // Add reviews, bookings to ignore
    private Service service;

    @ManyToOne(fetch = FetchType.LAZY) // Changed to LAZY for efficiency
    @JoinColumn(name = "provider_id", nullable = false)
    @JsonIgnoreProperties({"services", "password", "bookings", "reviews"}) // Add reviews to ignore
    private User provider;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private String status;   // Pending, Confirmed, Cancelled
    private Double price;

    // --- NEW: Add OneToOne mapping to Review ---
    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("booking") // To prevent infinite recursion
    private Review review;

    // --- Getters and setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Service getService() { return service; }
    public void setService(Service service) { this.service = service; }

    public User getProvider() { return provider; }
    public void setProvider(User provider) { this.provider = provider; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    // --- NEW: Getter and Setter for Review ---
    public Review getReview() { return review; }
    public void setReview(Review review) {
        if (review != null) {
            review.setBooking(this);
        }
        this.review = review;
    }
}