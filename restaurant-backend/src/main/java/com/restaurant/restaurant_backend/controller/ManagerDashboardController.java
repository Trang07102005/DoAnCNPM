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
import com.restaurant.restaurant_backend.repository.FoodRepository;
import com.restaurant.restaurant_backend.repository.OrderDetailRepository;
import com.restaurant.restaurant_backend.repository.OrderRepository;
import com.restaurant.restaurant_backend.repository.UserRepository;
import com.restaurant.restaurant_backend.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/manager/dashboard")
@RequiredArgsConstructor
public class ManagerDashboardController {

    private final OrderRepository orderRepository;
    private final FoodRepository foodRepository;
    private final UserRepository userRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final DashboardService dashboardService;


    @GetMapping("/summary")
    public ResponseEntity<?> getSummary() {
        long totalOrders = orderRepository.count();
        double totalRevenue = orderRepository.sumTotal() != null ? orderRepository.sumTotal() : 0.0;
        long totalFoods = foodRepository.count();
        long totalUsers = userRepository.count();

        Map<String, Object> result = new HashMap<>();
        result.put("totalBookings", totalOrders);
        result.put("totalRevenue", totalRevenue);
        result.put("totalFoods", totalFoods);
        result.put("totalUsers", totalUsers);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/top-ordered-foods")
public ResponseEntity<?> getTopOrderedFoods() {
    List<Object[]> results = orderDetailRepository.findFoodOrderCounts();
    
    List<Map<String, Object>> response = results.stream().map(row -> {
        Map<String, Object> item = new HashMap<>();
        item.put("foodName", row[0]);
        item.put("imageUrl", row[1]);
        item.put("totalOrdered", row[2]);
        return item;
    }).collect(Collectors.toList());

    return ResponseEntity.ok(response);
}

@GetMapping("/order-stats")
public ResponseEntity<?> getOrderStats(@RequestParam String type) {
    return ResponseEntity.ok(dashboardService.getOrderStats(type));
}

@GetMapping("/revenue-stats")
public ResponseEntity<?> getRevenueStats(@RequestParam String type) {
    List<String> validTypes = List.of("daily", "monthly", "yearly");
    if (!validTypes.contains(type)) {
        return ResponseEntity.badRequest().body("Invalid type. Allowed values: daily, monthly, yearly.");
    }

    return ResponseEntity.ok(dashboardService.getRevenueStats(type));
}






    

}

