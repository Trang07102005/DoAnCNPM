package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Integer> {
    Recipe findByFood_FoodId(Integer foodId);
}