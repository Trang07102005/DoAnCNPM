package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.Order; // Import Entity Order
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByRestaurantTable_TableId(Integer tableId); // <-- Đã sửa
    List<Order> findByStatus(String status);
    List<Order> findByOrderTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    List<Order> findByCreatedBy_UserId(Integer userId); // Tìm đơn hàng theo người tạo (User ID)
}