package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.dto.TopSellingFoodDTO;
import com.restaurant.restaurant_backend.model.TopSellingFood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TopSellingFoodRepository extends JpaRepository<TopSellingFood, Integer> {
    List<TopSellingFood> findByReportDate(LocalDate reportDate); // Tìm món ăn bán chạy theo ngày
    @Query("SELECT new com.restaurant.restaurant_backend.dto.TopSellingFoodDTO(tf.food.foodName, tf.totalSold) " +
    "FROM TopSellingFood tf WHERE tf.reportDate = :date ORDER BY tf.totalSold DESC")
List<TopSellingFoodDTO> findTopSellingFoodsByDate(@Param("date") LocalDate date);
}