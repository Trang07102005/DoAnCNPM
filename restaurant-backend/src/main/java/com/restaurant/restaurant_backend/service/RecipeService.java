package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.Recipe;
import com.restaurant.restaurant_backend.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository recipeRepository;

    // Lấy tất cả công thức
    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    // Lấy công thức theo ID
    public Optional<Recipe> getRecipeById(Integer id) {
        return recipeRepository.findById(id);
    }

    // Lấy công thức theo món ăn (Food ID)
    public Optional<Recipe> getRecipeByFoodId(Integer foodId) {
        return recipeRepository.findByFood_FoodId(foodId);
    }

    // Tạo mới công thức — 1 món chỉ được tạo 1 công thức
    public Recipe createRecipe(Recipe recipe) {
        Optional<Recipe> existing = recipeRepository.findByFood_FoodId(recipe.getFood().getFoodId());
        if (existing.isPresent()) {
            throw new UnsupportedOperationException("Món ăn này đã có công thức!");
        }
        return recipeRepository.save(recipe);
    }

    // Cập nhật công thức
    public Recipe updateRecipe(Integer id, Recipe updatedRecipe) {
        Recipe existing = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy công thức!"));

        existing.setDescription(updatedRecipe.getDescription());
        // Food không cho đổi — vì mỗi công thức gắn với đúng 1 món cố định
        return recipeRepository.save(existing);
    }

    // Xoá công thức (tuỳ chọn)
    public void deleteRecipe(Integer id) {
        if (!recipeRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy công thức!");
        }
        recipeRepository.deleteById(id);
    }
}
