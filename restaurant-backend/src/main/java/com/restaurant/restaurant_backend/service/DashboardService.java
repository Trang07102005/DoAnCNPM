package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.dto.OrderChartDTO;
import com.restaurant.restaurant_backend.dto.RevenueStatsDTO;
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

    public List<OrderChartDTO> getOrderStats(String type) {
        List<Object[]> data;

        switch (type.toLowerCase()) {
            case "day":
                data = orderRepository.countOrdersByDay();
                break;
            case "month":
                data = orderRepository.countOrdersByMonth();
                break;
            case "year":
                data = orderRepository.countOrdersByYear();
                break;
            default:
                throw new IllegalArgumentException("Type must be: day, month, or year");
        }

        return data.stream()
                .map(obj -> new OrderChartDTO(obj[0].toString(), ((Number) obj[1]).intValue()))
                .collect(Collectors.toList());
    }

    public List<RevenueStatsDTO> getRevenueStats(String type) {
        List<Object[]> rawData;

        switch (type.toLowerCase()) {
            case "daily":
                rawData = orderRepository.sumRevenueByDay();
                break;
            case "monthly":
                rawData = orderRepository.sumRevenueByMonth();
                break;
            case "yearly":
                rawData = orderRepository.sumRevenueByYear();
                break;
            default:
                throw new IllegalArgumentException("Invalid type: " + type);
        }

        return rawData.stream().map(row -> {
            String label = row[0].toString(); // ngày / tháng / năm (String)
            Double total = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;

            return new RevenueStatsDTO(label, total);
        }).collect(Collectors.toList());
    }
    



}
