package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.Ingredient;

import java.math.BigDecimal;
import java.util.List;

public interface IngredientService {
    List<Ingredient> getAllIngredients();
    Ingredient getIngredientById(Integer id);
    Ingredient addIngredient(Ingredient ingredient);
    Ingredient updateIngredient(Integer id, Ingredient ingredient);
    void deleteIngredient(Integer id);
    void reduceIngredientStock(Integer ingredientId, BigDecimal quantityUsed) throws RuntimeException;

}
