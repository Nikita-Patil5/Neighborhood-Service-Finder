package com.neighborhood.servicefinder.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neighborhood.servicefinder.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmail(String email);

}
