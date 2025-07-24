package com.restaurant.restaurant_backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {
    private String month;
    private int totalOrders;
    private double totalRevenue;
    private int totalFoods;
    private int totalUsers;
}
