package com.neighborhood.servicefinder.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.neighborhood.servicefinder.dto.LoginResponseDTO;
import com.neighborhood.servicefinder.dto.RegisterRequestDTO;
import com.neighborhood.servicefinder.dto.UserRequestDTO;
import com.neighborhood.servicefinder.model.Role;
import com.neighborhood.servicefinder.model.User;
import com.neighborhood.servicefinder.repository.UserRepository;
import com.neighborhood.servicefinder.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequestDTO request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("User already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhone());  // ✅
        user.setAddress(request.getAddress());    // ✅
        //user.setRole(Role.valueOf("ROLE_" + request.getRole()));
        user.setRole(request.getRole());


        userRepository.save(user);
        return ResponseEntity.ok("Registration successful!");
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserRequestDTO loginRequest) {
        Optional<User> existingUser = userRepository.findByEmail(loginRequest.getEmail());
        if (existingUser.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = existingUser.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return ResponseEntity.ok(new LoginResponseDTO(token, user.getRole(), user.getId()));
    }
}
