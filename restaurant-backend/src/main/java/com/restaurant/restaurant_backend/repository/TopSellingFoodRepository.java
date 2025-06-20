package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.TopSellingFood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TopSellingFoodRepository extends JpaRepository<TopSellingFood, Integer> {
    List<TopSellingFood> findByReportDate(LocalDate reportDate); // Tìm món ăn bán chạy theo ngày
}