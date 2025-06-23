package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.FoodCategory;
import com.restaurant.restaurant_backend.service.FoodCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class FoodCategoryController {

    private final FoodCategoryService foodCategoryService;

    // GET all
    @GetMapping
    public List<FoodCategory> getAllCategories() {
        return foodCategoryService.getAllCategories();
    }

    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Integer id) {
        try {
            FoodCategory category = foodCategoryService.getCategoryById(id);
            return ResponseEntity.ok(category);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lỗi: " + ex.getMessage());
        }
    }

    // POST new
    @PostMapping
    public ResponseEntity<FoodCategory> createCategory(@RequestBody FoodCategory category) {
        FoodCategory created = foodCategoryService.createCategory(category);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // PUT update
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Integer id, @RequestBody FoodCategory category) {
        try {
            FoodCategory updated = foodCategoryService.updateCategory(id, category);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lỗi: " + ex.getMessage());
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Integer id) {
        try {
            foodCategoryService.deleteCategory(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Không thể xoá danh mục: " + ex.getMessage());
        }
    }
}
