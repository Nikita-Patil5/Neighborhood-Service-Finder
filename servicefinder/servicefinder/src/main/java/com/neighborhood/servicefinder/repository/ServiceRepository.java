package com.neighborhood.servicefinder.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neighborhood.servicefinder.model.Service;
import com.neighborhood.servicefinder.model.User;

public interface ServiceRepository extends JpaRepository<Service, Long> {
	 List<Service> findByProvider(User provider); // Services created by a specific provider
	 List<Service> findByCategory(String category); // Optional: filter services by category


	 List<Service> findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
		        String name, String category, String description);

		default List<Service> searchByKeyword(String q) {
		    return findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q, q);
		}  
}
