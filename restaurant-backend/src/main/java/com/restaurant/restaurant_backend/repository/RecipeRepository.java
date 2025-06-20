package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Integer> {
    Optional<Recipe> findByFood_FoodId(Integer foodId); // Tìm công thức theo Food ID
}