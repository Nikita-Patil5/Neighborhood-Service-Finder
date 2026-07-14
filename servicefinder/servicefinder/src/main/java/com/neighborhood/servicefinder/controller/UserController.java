package com.neighborhood.servicefinder.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.neighborhood.servicefinder.dto.UserResponseDTO;
import com.neighborhood.servicefinder.exception.ResourceNotFoundException;
import com.neighborhood.servicefinder.model.Booking;
import com.neighborhood.servicefinder.model.Role;
import com.neighborhood.servicefinder.model.Service;
import com.neighborhood.servicefinder.model.User;
import com.neighborhood.servicefinder.repository.BookingRepository;
import com.neighborhood.servicefinder.repository.ServiceRepository;
import com.neighborhood.servicefinder.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // Get all users (ADMIN only)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userRepository.findAll()
                .stream()
                .map(UserResponseDTO::new)
                .filter(user -> user.getRole() == Role.ROLE_USER)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // Get user by ID (Authenticated users)
    @PreAuthorize("hasAnyRole('USER','PROVIDER','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(new UserResponseDTO(user));
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/providers")
    public ResponseEntity<List<UserResponseDTO>> getAllProviders() {
        List<UserResponseDTO> users = userRepository.findAll()
                .stream()
                .map(UserResponseDTO::new)
                .filter(user -> user.getRole() == Role.ROLE_PROVIDER)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }
    
    
 // Delete a user by ID (ADMIN only)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() != Role.ROLE_USER) {
            return ResponseEntity.badRequest().body("Cannot delete non-user with this endpoint");
        }

        // 1️⃣ Find all bookings by this user
        List<Booking> bookings = bookingRepository.findByUser(user);

        // 2️⃣ Delete bookings if any
        if (!bookings.isEmpty()) {
            bookingRepository.deleteAll(bookings);
        }

        // 3️⃣ Delete the user
        userRepository.delete(user);

        return ResponseEntity.ok("User and their bookings deleted successfully");
    }

 // Delete a provider by ID (ADMIN only)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/providers/{id}")
    public ResponseEntity<String> deleteProvider(@PathVariable Long id) {
        User provider = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        if (provider.getRole() != Role.ROLE_PROVIDER) {
            return ResponseEntity.badRequest().body("Cannot delete non-provider with this endpoint");
        }

        // 1️⃣ Find all services by this provider
        List<Service> services = serviceRepository.findByProvider(provider);

        // 2️⃣ Delete bookings for each service
        for (Service service : services) {
            List<Booking> bookings = bookingRepository.findByService(service);
            if (!bookings.isEmpty()) {
                bookingRepository.deleteAll(bookings);
            }
        }

        // 3️⃣ Delete services
        if (!services.isEmpty()) {
            serviceRepository.deleteAll(services);
        }

        // 4️⃣ Delete the provider
        userRepository.delete(provider);

        return ResponseEntity.ok("Provider, their services, and bookings deleted successfully");
    }

}
