package com.neighborhood.servicefinder.dto;

import com.neighborhood.servicefinder.model.Role;

public class LoginResponseDTO {

    private String token;
    private String type = "Bearer";
    private Role role;
    private Long userId; // New field

    // Constructor
    public LoginResponseDTO(String token, Role role, Long userId) {
        this.token = token;
        this.role = role;
        this.userId = userId;
    }

    // Getters & Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
