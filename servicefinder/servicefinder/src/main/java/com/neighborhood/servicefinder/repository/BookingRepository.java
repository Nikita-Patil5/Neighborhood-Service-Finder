//package com.neighborhood.servicefinder.repository;
//
//import java.time.LocalDate;
//import java.time.LocalTime;
//import java.util.List;
//import java.util.Optional;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//import com.neighborhood.servicefinder.model.Booking;
//import com.neighborhood.servicefinder.model.Service;
//import com.neighborhood.servicefinder.model.User;
//
//public interface BookingRepository extends JpaRepository<Booking, Long> {
//
//	List<Booking> findByUser(User user);        // Bookings of a specific user
//    List<Booking> findByProvider(User provider); // Bookings for a provider
//    List<Booking> findByService(Service service);
//    boolean existsByProviderAndDateAndStartTimeAndEndTime(
//            User provider,
//            LocalDate date,
//            LocalTime startTime,
//            LocalTime endTime
//    );
//    
//    // Fetch all bookings with their related User, Service, Provider, and Review
//    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.user u LEFT JOIN FETCH b.service s LEFT JOIN FETCH b.provider p LEFT JOIN FETCH b.review r")
//    List<Booking> findAllWithReviews();
//
//    // Fetch a single booking by ID with its related entities and Review
//    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.user u LEFT JOIN FETCH b.service s LEFT JOIN FETCH b.provider p LEFT JOIN FETCH b.review r WHERE b.id = :id")
//    Optional<Booking> findByIdWithReview(@Param("id") Long id);
//
//    // Fetch bookings for a specific user with their related entities and Review
//    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.user u LEFT JOIN FETCH b.service s LEFT JOIN FETCH b.provider p LEFT JOIN FETCH b.review r WHERE u = :user")
//    List<Booking> findByUserWithReviews(@Param("user") User user);
//
//    // Fetch bookings for a specific provider with their related entities and Review
//    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.user u LEFT JOIN FETCH b.service s LEFT JOIN FETCH b.provider p LEFT JOIN FETCH b.review r WHERE p = :provider")
//    List<Booking> findByProviderWithReviews(@Param("provider") User provider);
//}

package com.neighborhood.servicefinder.repository;

import com.neighborhood.servicefinder.model.Booking;
import com.neighborhood.servicefinder.model.Service;
import com.neighborhood.servicefinder.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Existing method
    boolean existsByProviderAndDateAndStartTimeAndEndTime(User provider, LocalDate date, LocalTime startTime, LocalTime endTime);

    // Custom query for Admin to get all bookings with their reviews (if any)
    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.review LEFT JOIN FETCH b.user LEFT JOIN FETCH b.service s LEFT JOIN FETCH s.provider")
    List<Booking> findAllWithReviews();

    // Custom query for User/Admin to get a single booking by ID with its review
    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.review LEFT JOIN FETCH b.user LEFT JOIN FETCH b.service s LEFT JOIN FETCH s.provider WHERE b.id = :id")
    Optional<Booking> findByIdWithReview(@Param("id") Long id);

    // Custom query for User to get their bookings with reviews
    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.review LEFT JOIN FETCH b.user LEFT JOIN FETCH b.service s LEFT JOIN FETCH s.provider WHERE b.user = :user ORDER BY b.date DESC, b.startTime DESC")
    List<Booking> findByUserWithReviews(@Param("user") User user);
    
    // Custom query for Provider to get their bookings with reviews
    @Query("SELECT b FROM Booking b LEFT JOIN FETCH b.review LEFT JOIN FETCH b.user LEFT JOIN FETCH b.service s LEFT JOIN FETCH s.provider WHERE b.provider = :provider ORDER BY b.date DESC, b.startTime DESC")
    List<Booking> findByProviderWithReviews(@Param("provider") User provider);

    // Existing method (used in ProviderController for their bookings without reviews)
    List<Booking> findByUser(User user);
    List<Booking> findByProvider(User provider);
    List<Booking> findByService(Service service);
}