package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.Food;
import com.restaurant.restaurant_backend.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FoodService {

    @Autowired
    private FoodRepository foodRepository;

    // ✅ Lấy tất cả món ăn
    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    // ✅ Lấy theo ID
    public Optional<Food> getFoodById(Integer id) {
        return foodRepository.findById(id);
    }

    // ✅ Lấy theo trạng thái
    public List<Food> getFoodsByStatus(String status) {
        return foodRepository.findByStatus(status);
    }

    // ✅ Lấy theo CategoryID
    public List<Food> getFoodsByCategoryId(Integer categoryId) {
        return foodRepository.findByCategory_CategoryId(categoryId);
    }

    // ✅ Tìm theo tên (search)
    public List<Food> searchFoodsByName(String foodName) {
        return foodRepository.findByFoodNameContainingIgnoreCase(foodName);
    }

    // ✅ Tạo mới
    public Food createFood(Food food) {
        validateStatus(food.getStatus());
        return foodRepository.save(food);
    }

    // ✅ Cập nhật
    public Food updateFood(Integer id, Food updatedFood) {
        validateStatus(updatedFood.getStatus());
        updatedFood.setFoodId(id);
        return foodRepository.save(updatedFood);
    }

    // ✅ Xoá
    public void deleteFood(Integer id) {
        foodRepository.deleteById(id);
    }

    // ✅ Validate status
    private void validateStatus(String status) {
        if (!(status.equals("Đang bán") || status.equals("Tạm ngưng") || status.equals("Ngưng bán"))) {
            throw new IllegalArgumentException("Status must be 'Đang bán', 'Tạm ngưng', or 'Ngưng bán'");
        }
    }
}
