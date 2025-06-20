package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.RecipeDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeDetailRepository extends JpaRepository<RecipeDetail, Integer> {
    List<RecipeDetail> findByRecipe_RecipeId(Integer recipeId); // Tìm chi tiết công thức theo Recipe ID
}