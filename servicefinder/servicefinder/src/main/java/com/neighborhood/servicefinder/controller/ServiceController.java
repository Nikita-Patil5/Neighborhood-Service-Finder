//package com.neighborhood.servicefinder.controller;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//import jakarta.validation.Valid;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.*;
//
//import com.neighborhood.servicefinder.dto.ServiceRequestDTO;
//import com.neighborhood.servicefinder.dto.ServiceResponseDTO;
//import com.neighborhood.servicefinder.exception.ResourceNotFoundException;
//import com.neighborhood.servicefinder.model.Booking;
//import com.neighborhood.servicefinder.model.Service;
//import com.neighborhood.servicefinder.model.User;
//import com.neighborhood.servicefinder.repository.BookingRepository;
//import com.neighborhood.servicefinder.repository.ReviewRepository;
//import com.neighborhood.servicefinder.repository.ServiceRepository;
//import com.neighborhood.servicefinder.repository.UserRepository;
//
//@RestController
//@RequestMapping("/api/services")
//public class ServiceController {
//
//    @Autowired
//    private ServiceRepository serviceRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//    
//    @Autowired
//    private BookingRepository bookingRepository;
//    
//    @Autowired
//    private ReviewRepository reviewRepository;
//
//    // 1️⃣ Get all services (Public)
//    @PreAuthorize("hasAnyRole('USER','PROVIDER','ADMIN')")
//    @GetMapping
//    public ResponseEntity<List<ServiceResponseDTO>> getAllServices() {
//        List<Service> services = serviceRepository.findAll();
//        List<ServiceResponseDTO> serviceDTOs = services.stream()
//                .map(ServiceResponseDTO::new)
//                .collect(Collectors.toList());
//        return ResponseEntity.ok(serviceDTOs);
//    }
//
//    // 2️⃣ Get a single service by ID (Public)
//    @PreAuthorize("hasAnyRole('USER','PROVIDER','ADMIN')")
//    @GetMapping("/{id}")
//    public ResponseEntity<ServiceResponseDTO> getServiceById(@PathVariable Long id) {
//        Service service = serviceRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
//        return ResponseEntity.ok(new ServiceResponseDTO(service));
//    }
//
//    // 3️⃣ Provider creates a new service
//    @PreAuthorize("hasRole('PROVIDER')")
//    @PostMapping
//    public ResponseEntity<ServiceResponseDTO> createService(
//            @Valid @RequestBody ServiceRequestDTO serviceRequest,
//            Authentication authentication) {
//
//        User provider = userRepository.findByEmail(authentication.getName())
//                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
//
//        Service service = new Service();
//        service.setName(serviceRequest.getName());
//        service.setCategory(serviceRequest.getCategory());
//        service.setDescription(serviceRequest.getDescription());
//        service.setPrice(serviceRequest.getPrice());
//        service.setProvider(provider);
//       
//
//        Service savedService = serviceRepository.save(service);
//        return ResponseEntity.ok(new ServiceResponseDTO(savedService));
//    }
//
//    // 4️⃣ Provider updates their service
//    @PreAuthorize("hasRole('PROVIDER')")
//    @PutMapping("/{id}")
//    public ResponseEntity<ServiceResponseDTO> updateService(
//            @PathVariable Long id,
//            @Valid @RequestBody ServiceRequestDTO serviceRequest,
//            Authentication authentication) {
//
//        Service service = serviceRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
//
//        User provider = userRepository.findByEmail(authentication.getName())
//                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
//
//        // Only owner can update
//        if (!service.getProvider().getId().equals(provider.getId())) {
//            return ResponseEntity.status(403).build();
//        }
//
//        service.setName(serviceRequest.getName());
//        service.setCategory(serviceRequest.getCategory());
//        service.setDescription(serviceRequest.getDescription());
//        service.setPrice(serviceRequest.getPrice());
//
//        Service updatedService = serviceRepository.save(service);
//        return ResponseEntity.ok(new ServiceResponseDTO(updatedService));
//    }
//
//    @PreAuthorize("hasAnyRole('PROVIDER', 'ADMIN')")
//    @DeleteMapping("/{id}")
//    public ResponseEntity<String> deleteService(@PathVariable Long id, Authentication authentication) {
//
//        // 1️⃣ Fetch the service
//        Service service = serviceRepository.findById(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
//
//        // 2️⃣ Fetch the logged-in user
//        User currentUser = userRepository.findByEmail(authentication.getName())
//                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
//
//        // 3️⃣ Only allow delete if ADMIN or the actual provider
//        boolean isAdmin = authentication.getAuthorities().stream()
//                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
//
//        if (!isAdmin && !service.getProvider().getId().equals(currentUser.getId())) {
//            return ResponseEntity.status(403).body("You are not allowed to delete this service");
//        }
//
//        // 4️⃣ Delete associated bookings
//        List<Booking> bookings = bookingRepository.findByService(service);
//        if (!bookings.isEmpty()) {
//            bookingRepository.deleteAll(bookings);
//        }
//
//        // 5️⃣ Delete the service
//        serviceRepository.delete(service);
//
//        return ResponseEntity.ok("Service and its bookings deleted successfully");
//    }
//
//
//    // 6️⃣ Get all services for the logged-in provider
//    @PreAuthorize("hasRole('PROVIDER')")
//    @GetMapping("/my-services")
//    public ResponseEntity<List<ServiceResponseDTO>> getMyServices(Authentication authentication) {
//        User provider = userRepository.findByEmail(authentication.getName())
//                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));
//
//        List<Service> services = serviceRepository.findByProvider(provider);
//        List<ServiceResponseDTO> serviceDTOs = services.stream()
//                .map(ServiceResponseDTO::new)
//                .collect(Collectors.toList());
//        return ResponseEntity.ok(serviceDTOs);
//    }
//}
//
//    
//}

package com.neighborhood.servicefinder.controller;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.neighborhood.servicefinder.dto.ServiceRequestDTO;
import com.neighborhood.servicefinder.dto.ServiceResponseDTO;
import com.neighborhood.servicefinder.exception.ResourceNotFoundException;
import com.neighborhood.servicefinder.model.Booking;
import com.neighborhood.servicefinder.model.Service;
import com.neighborhood.servicefinder.model.User;
import com.neighborhood.servicefinder.repository.BookingRepository;
import com.neighborhood.servicefinder.repository.ReviewRepository;
import com.neighborhood.servicefinder.repository.ServiceRepository;
import com.neighborhood.servicefinder.repository.UserRepository;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    // 1️⃣ Get all services (public)
    @PreAuthorize("hasAnyRole('USER','PROVIDER','ADMIN')")
    @GetMapping
    public ResponseEntity<List<ServiceResponseDTO>> getAllServices() {
        List<Service> services = serviceRepository.findAll();
        List<ServiceResponseDTO> response = services.stream()
                .map(service -> new ServiceResponseDTO(service, reviewRepository))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // 2️⃣ Get service by ID (public)
    @PreAuthorize("hasAnyRole('USER','PROVIDER','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponseDTO> getServiceById(@PathVariable Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        return ResponseEntity.ok(new ServiceResponseDTO(service, reviewRepository));
    }

    // 3️⃣ Provider creates a new service
    @PreAuthorize("hasRole('PROVIDER')")
    @PostMapping
    public ResponseEntity<ServiceResponseDTO> createService(
            @Valid @RequestBody ServiceRequestDTO serviceRequest,
            Authentication authentication) {

        User provider = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        Service service = new Service();
        service.setName(serviceRequest.getName());
        service.setCategory(serviceRequest.getCategory());
        service.setDescription(serviceRequest.getDescription());
        service.setPrice(serviceRequest.getPrice());
        service.setProvider(provider);

        Service savedService = serviceRepository.save(service);
        return ResponseEntity.ok(new ServiceResponseDTO(savedService, reviewRepository));
    }

    // 4️⃣ Provider updates their service
    @PreAuthorize("hasRole('PROVIDER')")
    @PutMapping("/{id}")
    public ResponseEntity<ServiceResponseDTO> updateService(
            @PathVariable Long id,
            @Valid @RequestBody ServiceRequestDTO serviceRequest,
            Authentication authentication) {

        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        User provider = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        if (!service.getProvider().getId().equals(provider.getId())) {
            return ResponseEntity.status(403).build();
        }

        service.setName(serviceRequest.getName());
        service.setCategory(serviceRequest.getCategory());
        service.setDescription(serviceRequest.getDescription());
        service.setPrice(serviceRequest.getPrice());

        Service updatedService = serviceRepository.save(service);
        return ResponseEntity.ok(new ServiceResponseDTO(updatedService, reviewRepository));
    }

    // 5️⃣ Provider/Admin deletes a service
    @PreAuthorize("hasAnyRole('PROVIDER','ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteService(@PathVariable Long id, Authentication authentication) {

        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !service.getProvider().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(403).body("You are not allowed to delete this service");
        }

        List<Booking> bookings = bookingRepository.findByService(service);
        if (!bookings.isEmpty()) {
            bookingRepository.deleteAll(bookings);
        }

        serviceRepository.delete(service);
        return ResponseEntity.ok("Service and its bookings deleted successfully");
    }

    // 6️⃣ Get all services of logged-in provider
    @PreAuthorize("hasRole('PROVIDER')")
    @GetMapping("/my-services")
    public ResponseEntity<List<ServiceResponseDTO>> getMyServices(Authentication authentication) {
        User provider = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        List<Service> services = serviceRepository.findByProvider(provider);
        List<ServiceResponseDTO> response = services.stream()
                .map(service -> new ServiceResponseDTO(service, reviewRepository))
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
