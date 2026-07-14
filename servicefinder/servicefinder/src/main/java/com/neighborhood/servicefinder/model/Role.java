package com.neighborhood.servicefinder.model;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Role {
	ROLE_USER,
    ROLE_PROVIDER,
    ROLE_ADMIN;
    
    @JsonCreator
    public static Role fromString(String value) {
        if (value == null) return null;
        value = value.toUpperCase();
        if (!value.startsWith("ROLE_")) {
            value = "ROLE_" + value;
        }
        return Role.valueOf(value);
    }

}
