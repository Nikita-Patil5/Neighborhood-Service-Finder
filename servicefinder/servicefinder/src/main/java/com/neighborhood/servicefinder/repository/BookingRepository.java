package com.neighborhood.servicefinder.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neighborhood.servicefinder.model.Booking;
import com.neighborhood.servicefinder.model.User;

public interface BookingRepository extends JpaRepository<Booking, Long> {

	List<Booking> findByUser(User user);        // Bookings of a specific user
    List<Booking> findByProvider(User provider); // Bookings for a provider
    boolean existsByProviderAndDateAndStartTimeAndEndTime(
            User provider,
            LocalDate date,
            LocalTime startTime,
            LocalTime endTime
    );
}
