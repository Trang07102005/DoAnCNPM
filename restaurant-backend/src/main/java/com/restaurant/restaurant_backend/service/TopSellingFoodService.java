package com.restaurant.restaurant_backend.service;

import java.time.LocalDate;
import java.util.List;
import com.restaurant.restaurant_backend.dto.TopSellingFoodDTO;
import org.springframework.stereotype.Service;

import com.restaurant.restaurant_backend.repository.TopSellingFoodRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TopSellingFoodService {
    private final TopSellingFoodRepository topSellingFoodRepository;

    public List<TopSellingFoodDTO> getTopSellingFoodsByDate(LocalDate date) {
        return topSellingFoodRepository.findTopSellingFoodsByDate(date);
    }
}
