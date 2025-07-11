package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.FoodCategory;
import com.restaurant.restaurant_backend.repository.FoodCategoryRepository;
import com.restaurant.restaurant_backend.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/food-categories")
@CrossOrigin(origins = "http://localhost:5173") // Cho phép frontend truy cập
public class FoodCategoryController {

    @Autowired
    private FoodCategoryRepository foodCategoryRepository;

    @Autowired
    private FoodRepository foodRepository;

    // Lấy tất cả danh mục món ăn (mọi người dùng đã xác thực)
    @GetMapping
    public List<FoodCategory> getAllFoodCategories() {
        return foodCategoryRepository.findAll();
    }

    // Lấy danh mục món ăn theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getFoodCategoryById(@PathVariable Integer id) {
        FoodCategory category = foodCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID = " + id));
        return ResponseEntity.ok(category);
    }

    // Tạo danh mục món ăn mới (chỉ admin)
    @PostMapping

    public ResponseEntity<?> createFoodCategory(@RequestBody FoodCategory category) {
        // Kiểm tra tên danh mục
        if (category.getCategoryName() == null || category.getCategoryName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Tên danh mục không được để trống");
        }

        // Kiểm tra trùng lặp tên danh mục
        if (foodCategoryRepository.findAll().stream()
                .anyMatch(existing -> existing.getCategoryName().equalsIgnoreCase(category.getCategoryName()))) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Tên danh mục đã tồn tại");
        }

        FoodCategory savedCategory = foodCategoryRepository.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
    }

    // Cập nhật danh mục món ăn (chỉ manager)
    @PutMapping("/{id}")
    //@PreAuthorize("hasRole('Manager')")
    public ResponseEntity<?> updateFoodCategory(@PathVariable Integer id, @RequestBody FoodCategory categoryDetails) {
        FoodCategory category = foodCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với ID = " + id));

        // Kiểm tra và cập nhật tên danh mục
        if (categoryDetails.getCategoryName() == null || categoryDetails.getCategoryName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Tên danh mục không được để trống");
        }

        // Kiểm tra trùng lặp tên danh mục với các danh mục khác
        if (foodCategoryRepository.findAll().stream()
                .anyMatch(existing -> existing.getCategoryName().equalsIgnoreCase(categoryDetails.getCategoryName())
                        && !existing.getCategoryId().equals(id))) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Tên danh mục đã tồn tại");
        }

        category.setCategoryName(categoryDetails.getCategoryName().trim());
        FoodCategory updatedCategory = foodCategoryRepository.save(category);
        return ResponseEntity.ok(updatedCategory);
    }

    // Xóa danh mục món ăn (chỉ manager)
    @DeleteMapping("/{id}")
    //@PreAuthorize("hasRole('Manager')")
    public ResponseEntity<?> deleteFoodCategory(@PathVariable Integer id) {
    if (!foodCategoryRepository.existsById(id)) {
        return ResponseEntity.notFound().build();
    }

    // Kiểm tra xem danh mục có đang được sử dụng bởi món ăn nào không
        if (foodRepository.existsByCategory_CategoryId(id)) {
    return ResponseEntity.status(HttpStatus.CONFLICT).body("Không thể xóa danh mục vì vẫn còn món ăn thuộc danh mục này");
    }

        foodCategoryRepository.deleteById(id);
        return ResponseEntity.ok("Xóa danh mục thành công");
    }
}