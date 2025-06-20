package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.RestaurantTable; // Import Entity Table
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Integer> {
    List<RestaurantTable> findByStatus(String status); // Tìm bàn theo trạng thái
    Optional<RestaurantTable> findByTableName(String tableName); // Tìm bàn theo tên bàn
}