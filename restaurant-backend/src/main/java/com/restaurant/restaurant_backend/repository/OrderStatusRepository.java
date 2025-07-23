package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderStatusRepository extends JpaRepository<OrderStatus, Integer> {
    List<OrderStatus> findByOrder_OrderId(Integer orderId); // Tìm trạng thái món ăn theo Order ID
    List<OrderStatus> findByFood_FoodId(Integer foodId); // Tìm trạng thái món ăn theo Food ID
    List<OrderStatus> findByStatus(String status); // Tìm trạng thái món ăn theo trạng thái
    List<OrderStatus> findByStatusIn(List<String> statuses); // Tìm trạng thái món ăn theo danh sách trạng thái
}