package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Integer> {
    List<Food> findByStatus(String status);
    List<Food> findByCategory_CategoryId(Integer categoryId);
    List<Food> findByFoodNameContainingIgnoreCase(String foodName);
    long countByCategory_CategoryId(Integer categoryId);
    boolean existsByCategory_CategoryId(Integer categoryId);
    


}