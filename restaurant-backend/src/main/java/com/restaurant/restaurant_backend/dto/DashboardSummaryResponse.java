package com.restaurant.restaurant_backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryResponse {
    private int totalFoods;
    private int totalUsers;
    private int totalBookings;
    private double totalRevenue;
}
