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

    // Kiểm tra nguyên liệu tồn kho đủ không
    for (RecipeCreateDTO.IngredientDetail detail : dto.getIngredients()) {
        Optional<Ingredient> ingOpt = ingredientRepo.findById(detail.getIngredientId());
        if (ingOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Nguyên liệu không tồn tại với id: " + detail.getIngredientId());
        }
        Ingredient ing = ingOpt.get();
        if (ing.getQuantityInStock().compareTo(detail.getQuantity()) < 0) {
            return ResponseEntity.badRequest()
                .body("Nguyên liệu '" + ing.getIngredientName() + "' không đủ tồn kho. Tồn: " 
                      + ing.getQuantityInStock() + ", yêu cầu: " + detail.getQuantity());
        }
    }

    // Tạo công thức
    Recipe recipe = new Recipe();
    recipe.setFood(foodOpt.get());
    recipe.setDescription(dto.getDescription());
    recipe = recipeRepo.save(recipe);

    // Thêm nguyên liệu vào công thức và trừ tồn kho
    for (RecipeCreateDTO.IngredientDetail detail : dto.getIngredients()) {
        Ingredient ing = ingredientRepo.findById(detail.getIngredientId()).get();

        RecipeDetail recipeDetail = new RecipeDetail();
        recipeDetail.setRecipe(recipe);
        recipeDetail.setIngredient(ing);
        recipeDetail.setQuantity(detail.getQuantity());
        detailRepo.save(recipeDetail);

        // Trừ tồn kho
        ing.setQuantityInStock(ing.getQuantityInStock().subtract(detail.getQuantity()));
        ingredientRepo.save(ing);
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

@Transactional
@PutMapping("/{id}")
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

    // Lấy chi tiết nguyên liệu cũ
    List<RecipeDetail> oldDetails = detailRepo.findByRecipe_RecipeId(recipe.getRecipeId());

    // Tính lại tồn kho: cộng lại số lượng nguyên liệu cũ đã dùng (hoàn trả)
    for (RecipeDetail oldDetail : oldDetails) {
        Ingredient ing = oldDetail.getIngredient();
        ing.setQuantityInStock(ing.getQuantityInStock().add(oldDetail.getQuantity()));
        ingredientRepo.save(ing);
    }

    // Kiểm tra nguyên liệu tồn kho đủ cho nguyên liệu mới không
    for (RecipeCreateDTO.IngredientDetail detail : dto.getIngredients()) {
        Optional<Ingredient> ingOpt = ingredientRepo.findById(detail.getIngredientId());
        if (ingOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Nguyên liệu không tồn tại với id: " + detail.getIngredientId());
        }
        Ingredient ing = ingOpt.get();
        if (ing.getQuantityInStock().compareTo(detail.getQuantity()) < 0) {
            return ResponseEntity.badRequest()
                .body("Nguyên liệu '" + ing.getIngredientName() + "' không đủ tồn kho. Tồn: " 
                      + ing.getQuantityInStock() + ", yêu cầu: " + detail.getQuantity());
        }
    }

    recipeRepo.save(recipe);

    // Xóa chi tiết nguyên liệu cũ
    detailRepo.deleteByRecipe(recipe);

    // Thêm nguyên liệu mới và trừ tồn kho
    for (RecipeCreateDTO.IngredientDetail detail : dto.getIngredients()) {
        Ingredient ing = ingredientRepo.findById(detail.getIngredientId()).get();

        RecipeDetail newDetail = new RecipeDetail();
        newDetail.setRecipe(recipe);
        newDetail.setIngredient(ing);
        newDetail.setQuantity(detail.getQuantity());
        detailRepo.save(newDetail);

        ing.setQuantityInStock(ing.getQuantityInStock().subtract(detail.getQuantity()));
        ingredientRepo.save(ing);
    }

    return ResponseEntity.ok("Cập nhật công thức thành công");
}


@Transactional
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteRecipe(@PathVariable Integer id) {
    Optional<Recipe> recipeOpt = recipeRepo.findById(id);
    if (recipeOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }

    Recipe recipe = recipeOpt.get();

    // Lấy chi tiết nguyên liệu của công thức
    List<RecipeDetail> details = detailRepo.findByRecipe_RecipeId(recipe.getRecipeId());

    // Hoàn trả tồn kho nguyên liệu
    for (RecipeDetail detail : details) {
        Ingredient ing = detail.getIngredient();
        ing.setQuantityInStock(ing.getQuantityInStock().add(detail.getQuantity()));
        ingredientRepo.save(ing);
    }

    // Xóa chi tiết nguyên liệu
    detailRepo.deleteByRecipe(recipe);

    // Xóa công thức
    recipeRepo.delete(recipe);

    return ResponseEntity.ok("Đã xóa công thức và hoàn trả tồn kho");
}



    

}
