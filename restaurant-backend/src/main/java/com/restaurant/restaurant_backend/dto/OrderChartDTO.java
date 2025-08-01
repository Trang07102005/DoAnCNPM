package com.restaurant.restaurant_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderChartDTO {
    private String label; // ví dụ: "2025-07-29", "07", "2025"
    private int count;    // số lượng order
}
