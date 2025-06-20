package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    List<OrderDetail> findByOrder_OrderId(Integer orderId); // Tìm chi tiết đơn hàng theo Order ID
    List<OrderDetail> findByFood_FoodId(Integer foodId); // Tìm chi tiết đơn hàng theo Food ID
}