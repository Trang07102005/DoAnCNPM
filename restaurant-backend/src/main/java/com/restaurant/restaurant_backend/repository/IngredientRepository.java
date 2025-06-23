package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Integer> {
    boolean existsByIngredientNameIgnoreCase(String ingredientName);
}
