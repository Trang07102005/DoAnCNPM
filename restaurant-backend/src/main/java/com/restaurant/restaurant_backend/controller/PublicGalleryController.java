package com.restaurant.restaurant_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.restaurant.restaurant_backend.model.Gallery;
import com.restaurant.restaurant_backend.repository.GalleryRepository;

@RestController
@RequestMapping("/api/gallery")
@CrossOrigin(origins = "http://localhost:5173")
public class PublicGalleryController {

    @Autowired
    private GalleryRepository galleryRepository;

    @GetMapping
    public List<Gallery> getPublicImages() {
        return galleryRepository.findAll(); // hoặc filter nếu muốn
    }
}

