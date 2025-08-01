package com.restaurant.restaurant_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecipeSummaryDTO {
    private Integer recipeId;
    private Integer foodId;
    private String foodName;
    private String description;
}
