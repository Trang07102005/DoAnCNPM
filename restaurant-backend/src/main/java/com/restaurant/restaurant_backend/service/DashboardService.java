package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.repository.FoodRepository;
import com.restaurant.restaurant_backend.repository.UserRepository;
import com.restaurant.restaurant_backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final FoodRepository foodRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalFoods", foodRepository.count());
        data.put("totalUsers", userRepository.count());
        data.put("totalBookings", orderRepository.count());
        data.put("totalRevenue", orderRepository.sumTotalRevenue());
        return data;
    }

    public List<Map<String, Object>> getOrderStatusPie() {
        List<Object[]> results = orderRepository.countOrdersByStatus();
        return results.stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("status", obj[0]);
            map.put("count", obj[1]);
            return map;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getUserRolePie() {
        List<Object[]> results = userRepository.countUsersByRole();
        return results.stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("role", obj[0]);
            map.put("count", obj[1]);
            return map;
        }).collect(Collectors.toList());
    }
}
