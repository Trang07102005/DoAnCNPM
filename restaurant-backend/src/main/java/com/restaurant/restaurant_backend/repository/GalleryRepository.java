package com.restaurant.restaurant_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.restaurant.restaurant_backend.model.Gallery;

public interface GalleryRepository extends JpaRepository<Gallery, Integer> {
}

