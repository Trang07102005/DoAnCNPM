package com.restaurant.restaurant_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopSellingFoodDTO {
    private String foodName;
    private Integer totalSold;
}