//package com.neighborhood.servicefinder.model;
//
//import java.time.LocalDateTime;
//
//import jakarta.persistence.*;
//
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Entity
//@Table(name = "reviews")
//public class Review {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    // Which service is being reviewed
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "service_id", nullable = false)
//    private Service service;
//
//    // Which user wrote the review
//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_id", nullable = false)
//    private User user;
//
//    private int rating; // 1 to 5
//    private String comment;
//
//    private LocalDateTime createdAt = LocalDateTime.now();
//
//	public Long getId() {
//		return id;
//	}
//
//	public void setId(Long id) {
//		this.id = id;
//	}
//
//	public Service getService() {
//		return service;
//	}
//
//	public void setService(Service service) {
//		this.service = service;
//	}
//
//	public User getUser() {
//		return user;
//	}
//
//	public void setUser(User user) {
//		this.user = user;
//	}
//
//	public int getRating() {
//		return rating;
//	}
//
//	public void setRating(int rating) {
//		this.rating = rating;
//	}
//
//	public String getComment() {
//		return comment;
//	}
//
//	public void setComment(String comment) {
//		this.comment = comment;
//	}
//
//	public LocalDateTime getCreatedAt() {
//		return createdAt;
//	}
//
//	public void setCreatedAt(LocalDateTime createdAt) {
//		this.createdAt = createdAt;
//	}
//    
//    
//}
//

package com.neighborhood.servicefinder.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", unique = true, nullable = false)
    @JsonIgnoreProperties("review")
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"reviews", "bookings", "password", "services"})
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    @JsonIgnoreProperties({"reviews", "bookings", "provider"})
    private Service service;

    private int rating; // 1-5 stars
    
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    @Column(length = 20)
    private String sentiment;          // positive | neutral | negative

    private Double sentimentScore;     // model confidence 0..1

    @Column(length = 255)
    private String aspects;            // e.g. "punctuality:negative,price:positive"

    private Boolean flagged = false;   // true = suspected spam, hidden/moderated by admin

    // --- RENAMED: from reviewDate to createdAt ---
    private LocalDateTime createdAt; // When the review was left

    // --- Constructors ---
    public Review() {
        this.createdAt = LocalDateTime.now(); // Set creation timestamp automatically
    }

    public Review(Booking booking, User user, Service service, int rating, String comment) {
        this(); // Call default constructor to set createdAt
        this.booking = booking;
        this.user = user;
        this.service = service;
        this.rating = rating;
        this.comment = comment;
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Service getService() { return service; }
    public void setService(Service service) { this.service = service; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    // --- RENAMED: Getter and Setter for createdAt ---
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public String getSentiment() { return sentiment; }
    public void setSentiment(String sentiment) { this.sentiment = sentiment; }

    public Double getSentimentScore() { return sentimentScore; }
    public void setSentimentScore(Double sentimentScore) { this.sentimentScore = sentimentScore; }

    public String getAspects() { return aspects; }
    public void setAspects(String aspects) { this.aspects = aspects; }

    public Boolean getFlagged() { return flagged; }
    public void setFlagged(Boolean flagged) { this.flagged = flagged; }

    // Optional: Add toString, equals, hashCode if needed
}