package com.restaurant.restaurant_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RevenueStatsDTO {
    private String label; // day/month/year
    private Double totalRevenue;

    // constructor, getter, setter
}
