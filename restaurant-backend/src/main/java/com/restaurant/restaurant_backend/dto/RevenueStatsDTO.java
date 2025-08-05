package com.restaurant.restaurant_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueStatsDTO {
    private String label; // day/month/year
    private Double totalRevenue;

}
