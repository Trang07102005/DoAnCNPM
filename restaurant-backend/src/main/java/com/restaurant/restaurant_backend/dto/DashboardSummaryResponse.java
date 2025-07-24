package com.restaurant.restaurant_backend.dto;

import lombok.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryResponse {
    private int totalFoods;
    private int totalUsers;
    private int totalBookings;
    private double totalRevenue;
    private List<DashboardResponse> monthlyRevenue;
}
