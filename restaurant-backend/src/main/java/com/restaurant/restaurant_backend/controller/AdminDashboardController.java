package com.restaurant.restaurant_backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.restaurant_backend.repository.FoodRepository;
import com.restaurant.restaurant_backend.repository.OrderRepository;
import com.restaurant.restaurant_backend.repository.UserRepository;
import com.restaurant.restaurant_backend.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final OrderRepository orderRepository;
    private final UserRepository usersRepository;
    private final FoodRepository foodRepository;
    private final DashboardService dashboardService;

    // Route: GET /api/admin/dashboard
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

    // Route: GET /api/admin/dashboard/summary
    @GetMapping("/summary")
    public ResponseEntity<?> getSummary() {
        return ResponseEntity.ok(dashboardService.getDashboardSummary());
    }

    // Route: GET /api/admin/dashboard/orders-by-status
    @GetMapping("/orders-by-status")
    public ResponseEntity<?> getOrdersByStatus() {
        return ResponseEntity.ok(dashboardService.getOrderStatusPie());
    }

    // Route: GET /api/admin/dashboard/users-by-role
    @GetMapping("/users-by-role")
    public ResponseEntity<?> getUsersByRole() {
        return ResponseEntity.ok(dashboardService.getUserRolePie());
    }
}
