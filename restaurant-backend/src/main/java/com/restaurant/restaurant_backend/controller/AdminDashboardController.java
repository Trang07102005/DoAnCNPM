package com.restaurant.restaurant_backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.restaurant_backend.repository.FoodRepository;
import com.restaurant.restaurant_backend.repository.OrderDetailRepository;
import com.restaurant.restaurant_backend.repository.OrderRepository;
import com.restaurant.restaurant_backend.repository.UserRepository;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private UserRepository usersRepository;

    @Autowired
    private FoodRepository foodRepository;

    @GetMapping
    public ResponseEntity<?> getDashboardStats() {
        long totalBookings = orderRepository.count(); // Số đơn hàng
        double totalRevenue = orderRepository.sumTotal() != null ? orderRepository.sumTotal() : 0.0;
        long totalFoods = foodRepository.count(); // Tổng số món ăn
        long totalUsers = usersRepository.count(); // Tổng số người dùng

        Map<String, Object> result = new HashMap<>();
        result.put("totalBookings", totalBookings);
        result.put("totalRevenue", totalRevenue);
        result.put("totalFoods", totalFoods);
        result.put("totalUsers", totalUsers);

        return ResponseEntity.ok(result);
    }
}

