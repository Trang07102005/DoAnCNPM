package com.restaurant.restaurant_backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.restaurant_backend.dto.RecipeCreateDTO;
import com.restaurant.restaurant_backend.dto.RecipeDetailResponseDTO;
import com.restaurant.restaurant_backend.dto.RecipeSummaryDTO;
import com.restaurant.restaurant_backend.model.Food;
import com.restaurant.restaurant_backend.model.Ingredient;
import com.restaurant.restaurant_backend.model.Recipe;
import com.restaurant.restaurant_backend.model.RecipeDetail;
import com.restaurant.restaurant_backend.repository.FoodRepository;
import com.restaurant.restaurant_backend.repository.IngredientRepository;
import com.restaurant.restaurant_backend.repository.RecipeDetailRepository;
import com.restaurant.restaurant_backend.repository.RecipeRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/manager/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeRepository recipeRepo;
    private final RecipeDetailRepository detailRepo;
    private final FoodRepository foodRepo;
    private final IngredientRepository ingredientRepo;

    @PostMapping("/add")
    @Transactional
    public ResponseEntity<?> addRecipe(@RequestBody RecipeCreateDTO dto) {
        Optional<Food> foodOpt = foodRepo.findById(dto.getFoodId());
        if (foodOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Không tìm thấy món ăn với id: " + dto.getFoodId());
        }

        Recipe recipe = new Recipe();
        recipe.setFood(foodOpt.get());
        recipe.setDescription(dto.getDescription());
        recipe = recipeRepo.save(recipe);

        for (RecipeCreateDTO.IngredientDetail detail : dto.getIngredients()) {
            Optional<Ingredient> ingOpt = ingredientRepo.findById(detail.getIngredientId());
            if (ingOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Nguyên liệu không tồn tại với id: " + detail.getIngredientId());
            }

            RecipeDetail recipeDetail = new RecipeDetail();
            recipeDetail.setRecipe(recipe);
            recipeDetail.setIngredient(ingOpt.get());
            recipeDetail.setQuantity(detail.getQuantity());
            detailRepo.save(recipeDetail);
        }

        return ResponseEntity.ok("Thêm công thức thành công");
    }

    @GetMapping("/all")
    public List<RecipeSummaryDTO> getAllRecipes() {
        List<Recipe> recipes = recipeRepo.findAll();
        return recipes.stream()
            .map(r -> new RecipeSummaryDTO(
                r.getRecipeId(),
                r.getFood().getFoodId(),
                r.getFood().getFoodName(),
                r.getDescription()
            ))
            .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable Integer id) {
        Optional<Recipe> recipeOpt = recipeRepo.findById(id);
        if (recipeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Recipe recipe = recipeOpt.get();
        List<RecipeDetail> details = detailRepo.findByRecipe_RecipeId(recipe.getRecipeId());
        List<RecipeDetailResponseDTO.IngredientDTO> ingredientDetails = details.stream()
            .map(d -> new RecipeDetailResponseDTO.IngredientDTO(
                d.getIngredient().getIngredientId(),
                d.getIngredient().getIngredientName(),
                d.getIngredient().getUnit(),
                d.getQuantity()
            ))
            .collect(Collectors.toList());

        RecipeDetailResponseDTO response = new RecipeDetailResponseDTO(
            recipe.getRecipeId(),
            recipe.getFood().getFoodId(),
            recipe.getFood().getFoodName(),
            recipe.getDescription(),
            ingredientDetails
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateRecipe(@PathVariable Integer id, @RequestBody RecipeCreateDTO dto) {
        Optional<Recipe> recipeOpt = recipeRepo.findById(id);
        if (recipeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Recipe recipe = recipeOpt.get();
        Optional<Food> foodOpt = foodRepo.findById(dto.getFoodId());
        if (foodOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Món ăn không tồn tại");
        }
        recipe.setFood(foodOpt.get());
        recipe.setDescription(dto.getDescription());
        recipeRepo.save(recipe);

        List<RecipeDetail> oldDetails = detailRepo.findByRecipe_RecipeId(recipe.getRecipeId());
        detailRepo.deleteByRecipe(recipe);

        for (RecipeCreateDTO.IngredientDetail detail : dto.getIngredients()) {
            Optional<Ingredient> ingOpt = ingredientRepo.findById(detail.getIngredientId());
            if (ingOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Nguyên liệu không tồn tại với id: " + detail.getIngredientId());
            }

            RecipeDetail newDetail = new RecipeDetail();
            newDetail.setRecipe(recipe);
            newDetail.setIngredient(ingOpt.get());
            newDetail.setQuantity(detail.getQuantity());
            detailRepo.save(newDetail);
        }

        return ResponseEntity.ok("Cập nhật công thức thành công");
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteRecipe(@PathVariable Integer id) {
        Optional<Recipe> recipeOpt = recipeRepo.findById(id);
        if (recipeOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Recipe recipe = recipeOpt.get();
        detailRepo.deleteByRecipe(recipe);
        recipeRepo.delete(recipe);

        return ResponseEntity.ok("Đã xóa công thức");
    }

    @GetMapping("/by-food/{foodId}")
    public ResponseEntity<?> getRecipeByFoodId(@PathVariable Integer foodId) {
        Recipe recipe = recipeRepo.findByFood_FoodId(foodId);
        if (recipe == null) {
            return ResponseEntity.notFound().build();
        }

        List<RecipeDetail> details = detailRepo.findByRecipe_RecipeId(recipe.getRecipeId());
        List<RecipeDetailResponseDTO.IngredientDTO> ingredientDetails = details.stream()
            .map(d -> new RecipeDetailResponseDTO.IngredientDTO(
                d.getIngredient().getIngredientId(),
                d.getIngredient().getIngredientName(),
                d.getIngredient().getUnit(),
                d.getQuantity()
            ))
            .collect(Collectors.toList());

        RecipeDetailResponseDTO response = new RecipeDetailResponseDTO(
            recipe.getRecipeId(),
            recipe.getFood().getFoodId(),
            recipe.getFood().getFoodName(),
            recipe.getDescription(),
            ingredientDetails
        );

        return ResponseEntity.ok(response);
    }
}