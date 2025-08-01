package com.restaurant.restaurant_backend.dto;


import java.util.List;
import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecipeCreateDTO {
    private Integer foodId;
    private String description;

    private List<IngredientDetail> ingredients;

    @Data
    public static class IngredientDetail {
        private Integer ingredientId;
        private BigDecimal quantity;
    }
}

