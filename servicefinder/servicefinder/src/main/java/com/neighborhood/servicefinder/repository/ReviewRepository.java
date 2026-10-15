package com.neighborhood.servicefinder.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.neighborhood.servicefinder.model.Review;
import com.neighborhood.servicefinder.model.Service;
import com.neighborhood.servicefinder.model.User;

public interface ReviewRepository extends JpaRepository<Review, Long> {
//    List<Review> findByService(Service service);
//    List<Review> findByUser(User user);
    Optional<Review> findByUserAndService(User user, Service service); // NEW for preventing duplicate reviews
    Optional<Review> findByBookingId(Long bookingId);
    List<Review> findByService(Service service);
    List<Review> findByUser(User user);
    boolean existsByBookingId(Long bookingId);
    @Query("SELECT r FROM Review r WHERE r.service = :service AND (r.flagged IS NULL OR r.flagged = false)")
    List<Review> findVisibleByService(@Param("service") Service service);
    List<Review> findByServiceProvider(User provider);
}
