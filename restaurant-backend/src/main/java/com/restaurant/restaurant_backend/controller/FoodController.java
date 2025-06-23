package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.Food;
import com.restaurant.restaurant_backend.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/foods")
public class FoodController {

    @Autowired
    private FoodService foodService;

    // ✅ Lấy tất cả
    @GetMapping
    public List<Food> getAllFoods() {
        return foodService.getAllFoods();
    }

    // ✅ Lấy theo ID
    @GetMapping("/{id}")
    public Optional<Food> getFoodById(@PathVariable Integer id) {
        return foodService.getFoodById(id);
    }

    // ✅ Lấy theo trạng thái
    @GetMapping("/status/{status}")
    public List<Food> getFoodsByStatus(@PathVariable String status) {
        return foodService.getFoodsByStatus(status);
    }

    // ✅ Lấy theo CategoryID
    @GetMapping("/category/{categoryId}")
    public List<Food> getFoodsByCategoryId(@PathVariable Integer categoryId) {
        return foodService.getFoodsByCategoryId(categoryId);
    }

    // ✅ Tìm kiếm theo tên
    @GetMapping("/search")
    public List<Food> searchFoodsByName(@RequestParam String name) {
        return foodService.searchFoodsByName(name);
    }

    // ✅ Tạo mới
    @PostMapping
    public Food createFood(@RequestBody Food food) {
        return foodService.createFood(food);
    }

    // ✅ Cập nhật
    @PutMapping("/{id}")
    public Food updateFood(@PathVariable Integer id, @RequestBody Food updatedFood) {
        return foodService.updateFood(id, updatedFood);
    }

    // ✅ Xoá
    @DeleteMapping("/{id}")
    public void deleteFood(@PathVariable Integer id) {
        foodService.deleteFood(id);
    }
}
