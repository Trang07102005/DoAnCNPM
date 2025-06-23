package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.FoodCategory;
import com.restaurant.restaurant_backend.service.FoodCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
public class FoodCategoryController {

    @Autowired
    private FoodCategoryService foodCategoryService;

    // ✅ Lấy tất cả
    @GetMapping
    public List<FoodCategory> getAllCategories() {
        return foodCategoryService.getAllCategories();
    }

    // ✅ Lấy theo ID
    @GetMapping("/{id}")
    public Optional<FoodCategory> getCategoryById(@PathVariable Integer id) {
        return foodCategoryService.getCategoryById(id);
    }

    // ✅ Tạo mới
    @PostMapping
    public FoodCategory createCategory(@RequestBody FoodCategory category) {
        return foodCategoryService.createCategory(category);
    }

    // ✅ Cập nhật
    @PutMapping("/{id}")
    public FoodCategory updateCategory(@PathVariable Integer id, @RequestBody FoodCategory updatedCategory) {
        return foodCategoryService.updateCategory(id, updatedCategory);
    }

    // ✅ Xóa: tự động check ràng buộc
    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Integer id) {
        foodCategoryService.deleteCategory(id);
    }
}
