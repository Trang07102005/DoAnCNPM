package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.dto.FoodRequest;
import com.restaurant.restaurant_backend.model.Food;
import com.restaurant.restaurant_backend.model.FoodCategory;
import com.restaurant.restaurant_backend.repository.FoodCategoryRepository;
import com.restaurant.restaurant_backend.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;


@RestController
@RequestMapping("/api/food")
@CrossOrigin(origins = "http://localhost:5173")
public class FoodController {

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private FoodCategoryRepository foodCategoryRepository;

    // ✅ Lấy tất cả món ăn
    @GetMapping
    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    @GetMapping("/{id}")
public ResponseEntity<?> getFoodById(@PathVariable Integer id) {
    Food food = foodRepository.findById(id).orElse(null);
    if (food == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy món ăn với ID = " + id);
    }
    return ResponseEntity.ok(food);
}


 @PostMapping
public ResponseEntity<?> createFood(@RequestBody FoodRequest req) {
    if (req.getFoodName() == null || req.getFoodName().trim().isEmpty()) {
        return ResponseEntity.badRequest().body("Tên món ăn không được để trống");
    }

    String newName = req.getFoodName().trim();
    boolean nameExists = foodRepository.findByFoodNameContainingIgnoreCase(newName)
            .stream()
            .anyMatch(f -> f.getFoodName().equalsIgnoreCase(newName));
    if (nameExists) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Tên món ăn đã tồn tại");
    }

    if (req.getPrice() == null || req.getPrice().compareTo(BigDecimal.valueOf(10000)) < 0) {
        return ResponseEntity.badRequest().body("Giá món ăn phải >= 10,000");
    }

    if (req.getCategoryId() == null) {
        return ResponseEntity.badRequest().body("Danh mục không được để trống");
    }

    FoodCategory category = foodCategoryRepository.findById(req.getCategoryId())
            .orElse(null);
    if (category == null) {
        return ResponseEntity.badRequest().body("Danh mục không tồn tại");
    }

    Food food = new Food(
            req.getFoodName().trim(),
            req.getPrice(),
            req.getImageUrl(),
            req.getStatus(),
            category
    );

    Food savedFood = foodRepository.save(food);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedFood);
}


@PutMapping("/{id}")
public ResponseEntity<?> updateFood(@PathVariable Integer id, @RequestBody FoodRequest req) {
    Food food = foodRepository.findById(id).orElse(null);
    if (food == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy món ăn với ID = " + id);
    }

    if (req.getFoodName() != null && !req.getFoodName().trim().isEmpty()) {
        String newName = req.getFoodName().trim();
        boolean nameExists = foodRepository.findByFoodNameContainingIgnoreCase(newName)
                .stream()
                .anyMatch(f -> f.getFoodName().equalsIgnoreCase(newName) && !f.getFoodId().equals(id));
        if (nameExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Tên món ăn đã tồn tại");
        }
        food.setFoodName(newName);
    }

    if (req.getPrice() != null) {
        if (req.getPrice().compareTo(BigDecimal.valueOf(10000)) < 0) {
            return ResponseEntity.badRequest().body("Giá món ăn phải >= 10,000");
        }
        food.setPrice(req.getPrice());
    }

    if (req.getImageUrl() != null) {
        food.setImageUrl(req.getImageUrl());
    }

    if (req.getStatus() != null) {
        food.setStatus(req.getStatus());
    }

    if (req.getCategoryId() != null) {
        FoodCategory category = foodCategoryRepository.findById(req.getCategoryId())
                .orElse(null);
        if (category == null) {
            return ResponseEntity.badRequest().body("Danh mục không tồn tại");
        }
        food.setCategory(category);
    }

    Food updatedFood = foodRepository.save(food);
    return ResponseEntity.ok(updatedFood);
}


    // ✅ Xóa món ăn
    @DeleteMapping("/{id}")
    //@PreAuthorize("hasRole('Manager')")
    public ResponseEntity<?> deleteFood(@PathVariable Integer id) {
        if (!foodRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy món ăn với ID = " + id);
        }
        foodRepository.deleteById(id);
        return ResponseEntity.ok("Xóa món ăn thành công");
    }
}
