package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.FoodCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodCategoryRepository extends JpaRepository<FoodCategory, Integer> {
    // Các phương thức CRUD sẽ được cung cấp tự động
     long countByCategory_CategoryId(Integer categoryId);
}