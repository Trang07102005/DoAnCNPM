package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FoodRepository extends JpaRepository<Food, Integer> {
    // Có thể thêm các phương thức tùy chỉnh:
    List<Food> findByStatus(String status); // Tìm món ăn theo trạng thái
    List<Food> findByCategory_CategoryId(Integer categoryId); // Tìm món ăn theo Category ID
    List<Food> findByFoodNameContainingIgnoreCase(String foodName); // Tìm món ăn theo tên (không phân biệt hoa thường)
}