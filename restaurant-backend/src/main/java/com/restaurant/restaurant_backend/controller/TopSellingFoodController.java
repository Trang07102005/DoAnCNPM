package com.restaurant.restaurant_backend.controller;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.restaurant.restaurant_backend.repository.OrderDetailRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
public class TopSellingFoodController {
    private final OrderDetailRepository orderDetailRepository;

    @GetMapping("/top-ordered-food")
    public ResponseEntity<?> getTopOrderedFoods(@RequestParam(required = false) Integer categoryId) {
        List<Object[]> results;
    
        if (categoryId != null) {
            results = orderDetailRepository.findFoodOrderCountsByCategory(categoryId);
        } else {
            results = orderDetailRepository.findFoodOrderCounts();
        }
    
        List<Map<String, Object>> response = results.stream().map(row -> {
            Map<String, Object> item = new HashMap<>();
            item.put("foodName", row[0]);
            item.put("imageUrl", row[1]);
            item.put("totalOrdered", row[2]);
            return item;
        }).collect(Collectors.toList());
    
        return ResponseEntity.ok(response);
    }
}

