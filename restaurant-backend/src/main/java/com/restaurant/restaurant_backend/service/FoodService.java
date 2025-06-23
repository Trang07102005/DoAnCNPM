package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.Food;
import com.restaurant.restaurant_backend.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class FoodService {

    private final FoodRepository foodRepository;

    // Lấy tất cả món ăn
    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    // Lấy món ăn theo ID
    public Food getFoodById(Integer id) {
        return foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found with ID: " + id));
    }

    // Lấy món ăn theo trạng thái
    public List<Food> getFoodsByStatus(String status) {
        return foodRepository.findByStatus(status);
    }

    // Lấy món ăn theo Category ID
    public List<Food> getFoodsByCategoryId(Integer categoryId) {
        return foodRepository.findByCategory_CategoryId(categoryId);
    }

    // Tìm kiếm theo tên
    public List<Food> searchFoodsByName(String keyword) {
        return foodRepository.findByFoodNameContainingIgnoreCase(keyword);
    }

    // Đếm số món ăn theo Category ID
    public long countFoodsByCategoryId(Integer categoryId) {
        return foodRepository.countByCategory_CategoryId(categoryId);
    }

    // Tạo mới món ăn
    public Food createFood(Food food) {
        food.setFoodId(null); // Đảm bảo ID = null để JPA auto generate
        return foodRepository.save(food);
    }

    // Cập nhật món ăn
    public Food updateFood(Integer id, Food updatedFood) {
        Food existingFood = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found with ID: " + id));

        existingFood.setFoodName(updatedFood.getFoodName());
        existingFood.setPrice(updatedFood.getPrice());
        existingFood.setImageUrl(updatedFood.getImageUrl());
        existingFood.setStatus(updatedFood.getStatus());
        existingFood.setCategory(updatedFood.getCategory());

        return foodRepository.save(existingFood);
    }

    // Xoá món ăn theo ID
    public void deleteFood(Integer id) {
        if (!foodRepository.existsById(id)) {
            throw new RuntimeException("Food not found with ID: " + id);
        }
        foodRepository.deleteById(id);
    }
}
