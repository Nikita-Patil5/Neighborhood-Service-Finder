package com.neighborhood.servicefinder.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

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
}
