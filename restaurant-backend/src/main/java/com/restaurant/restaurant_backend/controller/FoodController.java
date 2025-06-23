package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.Food;
import com.restaurant.restaurant_backend.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    /**
     * GET /api/foods
     * Lấy tất cả món ăn.
     */
    @GetMapping
    public List<Food> getAllFoods() {
        return foodService.getAllFoods();
    }

    /**
     * GET /api/foods/{id}
     * Lấy món ăn theo ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getFoodById(@PathVariable Integer id) {
        try {
            Food food = foodService.getFoodById(id);
            return ResponseEntity.ok(food);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    /**
     * GET /api/foods/status/{status}
     * Lấy món ăn theo trạng thái.
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Food>> getFoodsByStatus(@PathVariable String status) {
        List<Food> foods = foodService.getFoodsByStatus(status);
        return ResponseEntity.ok(foods);
    }

    /**
     * GET /api/foods/category/{categoryId}
     * Lấy món ăn theo Category ID.
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Food>> getFoodsByCategoryId(@PathVariable Integer categoryId) {
        return ResponseEntity.ok(foodService.getFoodsByCategoryId(categoryId));
    }

    /**
     * GET /api/foods/search?keyword=...
     * Tìm món ăn theo tên.
     */
    @GetMapping("/search")
    public ResponseEntity<List<Food>> searchFoodsByName(@RequestParam String keyword) {
        List<Food> foods = foodService.searchFoodsByName(keyword);
        return ResponseEntity.ok(foods);
    }

    /**
     * GET /api/foods/count/{categoryId}
     * Đếm số món ăn theo danh mục.
     */
    @GetMapping("/count/{categoryId}")
    public ResponseEntity<Long> countFoodsByCategoryId(@PathVariable Integer categoryId) {
        long count = foodService.countFoodsByCategoryId(categoryId);
        return ResponseEntity.ok(count);
    }

    /**
     * POST /api/foods
     * Tạo mới món ăn.
     */
    @PostMapping
    public ResponseEntity<Food> createFood(@RequestBody Food food) {
        Food createdFood = foodService.createFood(food);
        return new ResponseEntity<>(createdFood, HttpStatus.CREATED);
    }

    /**
     * PUT /api/foods/{id}
     * Cập nhật món ăn.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFood(@PathVariable Integer id, @RequestBody Food food) {
        try {
            Food updatedFood = foodService.updateFood(id, food);
            return ResponseEntity.ok(updatedFood);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    /**
     * DELETE /api/foods/{id}
     * Xoá món ăn.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFood(@PathVariable Integer id) {
        try {
            foodService.deleteFood(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}
