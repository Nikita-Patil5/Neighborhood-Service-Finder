package com.neighborhood.servicefinder.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.neighborhood.servicefinder.dto.UserRequestDTO;
import com.neighborhood.servicefinder.dto.UserResponseDTO;
import com.neighborhood.servicefinder.dto.LoginResponseDTO;
import com.neighborhood.servicefinder.exception.ResourceNotFoundException;
import com.neighborhood.servicefinder.model.Role;
import com.neighborhood.servicefinder.model.User;
import com.neighborhood.servicefinder.repository.UserRepository;
import com.neighborhood.servicefinder.security.JwtUtil;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // 1️⃣ Register new user/provider
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody UserRequestDTO userRequest) {
        Optional<User> existingUser = userRepository.findByEmail(userRequest.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("User already exists");
        }

        User user = new User();
        user.setName(userRequest.getName());
        user.setEmail(userRequest.getEmail());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        // ✅ Normalize role safely
        String roleStr = userRequest.getRole().toUpperCase();
        if (!roleStr.startsWith("ROLE_")) {
            roleStr = "ROLE_" + roleStr;
        }
        user.setRole(Role.valueOf(roleStr));

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    // 2️⃣ Login user/provider
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserRequestDTO loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        // ✅ Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        // ✅ Return token + role + userId
        return ResponseEntity.ok(new LoginResponseDTO(token, user.getRole().name(), user.getId()));
    }

    // 3️⃣ Get all users (ADMIN only)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userRepository.findAll()
                .stream()
                .map(UserResponseDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // 4️⃣ Get user by ID (authenticated users)
    @PreAuthorize("hasAnyRole('USER','PROVIDER','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return ResponseEntity.ok(new UserResponseDTO(user));
    }
}
