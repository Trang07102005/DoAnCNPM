// MonthlyRevenueDTO.java
package com.restaurant.restaurant_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlyRevenueDTO {
    private int month;
    private double revenue;
}
