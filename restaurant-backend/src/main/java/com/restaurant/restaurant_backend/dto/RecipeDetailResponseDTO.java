package com.restaurant.restaurant_backend.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecipeDetailResponseDTO {
private Integer recipeId;
    private Integer foodId;
    private String foodName;
    private String description;
    private List<IngredientDTO> ingredients;

    @Data
    @AllArgsConstructor
    public static class IngredientDTO {
        private Integer ingredientId;
        private String ingredientName;
        private String unit;
        private BigDecimal quantity;
    }
}
