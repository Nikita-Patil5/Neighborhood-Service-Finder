package com.neighborhood.servicefinder.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.context.Context;

import com.neighborhood.servicefinder.dto.BookingRequestDTO;
import com.neighborhood.servicefinder.dto.BookingResponseDTO;
import com.neighborhood.servicefinder.exception.ResourceNotFoundException;
import com.neighborhood.servicefinder.model.Booking;
import com.neighborhood.servicefinder.model.Service;
import com.neighborhood.servicefinder.model.User;
import com.neighborhood.servicefinder.repository.BookingRepository;
import com.neighborhood.servicefinder.repository.ServiceRepository;
import com.neighborhood.servicefinder.repository.UserRepository;
import com.neighborhood.servicefinder.service.EmailService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private EmailService emailService;

    // 1️⃣ User creates a booking
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BookingResponseDTO> createBooking(@RequestBody BookingRequestDTO bookingRequest,
                                                            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Service service = serviceRepository.findById(bookingRequest.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        User provider = service.getProvider();

        // Check if provider is already booked for this exact slot
        boolean slotTaken = bookingRepository.existsByProviderAndDateAndStartTimeAndEndTime(
                provider,
                bookingRequest.getDate(),
                bookingRequest.getStartTime(),
                bookingRequest.getEndTime()
        );

        if (slotTaken) {
            throw new RuntimeException("This time slot is already booked. Please choose another slot.");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setService(service);
        booking.setProvider(provider);
        booking.setDate(bookingRequest.getDate());
        booking.setStartTime(bookingRequest.getStartTime());
        booking.setEndTime(bookingRequest.getEndTime());
        booking.setStatus("PENDING");
        booking.setPrice(service.getPrice());
        Booking saved = bookingRepository.save(booking);

        // Send emails to user and provider (Thymeleaf template)
        sendBookingEmails(saved);

        // Convert to DTO for response
        BookingResponseDTO responseDTO = mapToDTO(saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    private void sendBookingEmails(Booking booking) {
        User user = booking.getUser();
        User provider = booking.getProvider();
        Service service = booking.getService();

        // User email
        Context userContext = new Context();
        userContext.setVariable("userName", user.getName());
        userContext.setVariable("serviceName", service.getName());
        userContext.setVariable("date", booking.getDate());
        userContext.setVariable("startTime", booking.getStartTime());
        userContext.setVariable("endTime", booking.getEndTime());
        userContext.setVariable("price", booking.getPrice());
        userContext.setVariable("bookingId", booking.getId());
        userContext.setVariable("status", booking.getStatus());
        emailService.sendHtmlTemplateEmail(user.getEmail(), "Booking Confirmation", "user-booking", userContext);

        // Provider email
        Context providerContext = new Context();
        providerContext.setVariable("providerName", provider.getName());
        providerContext.setVariable("serviceName", service.getName());
        providerContext.setVariable("userName", user.getName());
        providerContext.setVariable("date", booking.getDate());
        providerContext.setVariable("startTime", booking.getStartTime());
        providerContext.setVariable("endTime", booking.getEndTime());
        providerContext.setVariable("price", booking.getPrice());
        providerContext.setVariable("bookingId", booking.getId());
        providerContext.setVariable("status", booking.getStatus());
        emailService.sendHtmlTemplateEmail(provider.getEmail(), "New Booking Alert", "provider-booking", providerContext);
    }

    private BookingResponseDTO mapToDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setServiceName(booking.getService().getName());
        dto.setProviderName(booking.getProvider().getName());
        dto.setUserName(booking.getUser().getName());
        dto.setDate(booking.getDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setPrice(booking.getPrice());
        dto.setStatus(booking.getStatus());
        return dto;
    }

    // 2️⃣ Admin gets all bookings
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        List<BookingResponseDTO> list = bookingRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    // 3️⃣ User/Admin gets booking by ID
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable Long id, Authentication authentication) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole().name().equals("USER") && !booking.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // Forbidden
        }

        return ResponseEntity.ok(mapToDTO(booking));
    }

    // 4️⃣ User gets their bookings
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/my")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<BookingResponseDTO> list = bookingRepository.findByUser(user).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    // 5️⃣ Provider updates booking status
    @PreAuthorize("hasRole('PROVIDER')")
    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponseDTO> updateBookingStatus(@PathVariable Long id,
                                                                  @RequestParam String status,
                                                                  Authentication authentication) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        User provider = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        if (!booking.getProvider().getId().equals(provider.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        String normalized = status.toUpperCase();
        if (!List.of("CONFIRMED", "CANCELLED", "PENDING").contains(normalized)) {
            throw new RuntimeException("Invalid status value. Allowed: CONFIRMED, CANCELLED, PENDING");
        }

        booking.setStatus(normalized);
        Booking updated = bookingRepository.save(booking);

        // Notify user
        sendBookingEmails(updated);

        return ResponseEntity.ok(mapToDTO(updated));
    }

    // 6️⃣ Provider gets their bookings
    @PreAuthorize("hasRole('PROVIDER')")
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookingsForProvider(Authentication authentication) {
        User provider = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        List<BookingResponseDTO> list = bookingRepository.findByProvider(provider).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }
}
