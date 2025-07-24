package com.restaurant.restaurant_backend.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.restaurant_backend.dto.DashboardResponse;
import com.restaurant.restaurant_backend.repository.OrderRepository;
import com.restaurant.restaurant_backend.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final OrderRepository orderRepository;
    private final DashboardService dashboardService;

    @GetMapping("/monthly-stats")
    public List<DashboardResponse> getMonthlyStats() {
        List<DashboardResponse> result = new ArrayList<>();

        for (int i = 1; i <= 12; i++) {
            String monthLabel = String.format("Tháng %02d", i);
            int orders = orderRepository.countByMonth(i);
            double revenue = orderRepository.sumRevenueByMonth(i);

            // Bạn có thể đặt 0 cho các trường chưa cần dùng
            result.add(new DashboardResponse(monthLabel, orders, revenue, 0, 0));
        }

        return result;
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary() {
        return ResponseEntity.ok(dashboardService.getDashboardSummary());
    }

    @GetMapping("/orders-by-status")
    public ResponseEntity<?> getOrdersByStatus() {
        return ResponseEntity.ok(dashboardService.getOrderStatusPie());
    }

    @GetMapping("/users-by-role")
    public ResponseEntity<?> getUsersByRole() {
        return ResponseEntity.ok(dashboardService.getUserRolePie());
    }
}
