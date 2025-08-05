package com.restaurant.restaurant_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FoodCountDTO {
    private String foodName;
    private String imageUrl;
    private int quantity;
}
