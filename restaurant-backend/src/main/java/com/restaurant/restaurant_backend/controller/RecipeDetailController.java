package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.RecipeDetail;
import com.restaurant.restaurant_backend.service.RecipeDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipe-details")
@RequiredArgsConstructor
public class RecipeDetailController {

    private final RecipeDetailService recipeDetailService;

    // Lấy tất cả chi tiết công thức
    @GetMapping
    public ResponseEntity<List<RecipeDetail>> getAllRecipeDetails() {
        return ResponseEntity.ok(recipeDetailService.getAllRecipeDetails());
    }

    // Lấy chi tiết công thức theo ID
    @GetMapping("/{id}")
    public ResponseEntity<RecipeDetail> getRecipeDetailById(@PathVariable Integer id) {
        return recipeDetailService.getRecipeDetailById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Lấy chi tiết công thức theo Recipe ID
    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<List<RecipeDetail>> getRecipeDetailsByRecipeId(@PathVariable Integer recipeId) {
        return ResponseEntity.ok(recipeDetailService.getRecipeDetailsByRecipeId(recipeId));
    }

    // Tạo mới chi tiết công thức
    @PostMapping
    public ResponseEntity<RecipeDetail> createRecipeDetail(@RequestBody RecipeDetail recipeDetail) {
        return ResponseEntity.ok(recipeDetailService.createRecipeDetail(recipeDetail));
    }

    // Cập nhật chi tiết công thức
    @PutMapping("/{id}")
    public ResponseEntity<RecipeDetail> updateRecipeDetail(@PathVariable Integer id,
                                                           @RequestBody RecipeDetail updatedDetail) {
        return ResponseEntity.ok(recipeDetailService.updateRecipeDetail(id, updatedDetail));
    }

    // Xoá chi tiết công thức
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecipeDetail(@PathVariable Integer id) {
        recipeDetailService.deleteRecipeDetail(id);
        return ResponseEntity.ok("Xoá chi tiết công thức thành công!");
    }
}
