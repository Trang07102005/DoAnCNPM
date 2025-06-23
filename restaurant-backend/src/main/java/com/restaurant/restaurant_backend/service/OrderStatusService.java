package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.OrderStatus;
import com.restaurant.restaurant_backend.repository.OrderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderStatusService {

    @Autowired
    private OrderStatusRepository orderStatusRepository;

    // ✅ Lấy tất cả
    public List<OrderStatus> getAllOrderStatuses() {
        return orderStatusRepository.findAll();
    }

    // ✅ Lấy theo ID
    public Optional<OrderStatus> getOrderStatusById(Integer id) {
        return orderStatusRepository.findById(id);
    }

    // ✅ Lấy theo OrderID
    public List<OrderStatus> getOrderStatusesByOrderId(Integer orderId) {
        return orderStatusRepository.findByOrder_OrderId(orderId);
    }

    // ✅ Lấy theo FoodID
    public List<OrderStatus> getOrderStatusesByFoodId(Integer foodId) {
        return orderStatusRepository.findByFood_FoodId(foodId);
    }

    // ✅ Lấy theo Status
    public List<OrderStatus> getOrderStatusesByStatus(String status) {
        return orderStatusRepository.findByStatus(status);
    }

    // ✅ Tạo mới
    public OrderStatus createOrderStatus(OrderStatus orderStatus) {
        validateStatus(orderStatus.getStatus());
        orderStatus.setUpdatedAt(LocalDateTime.now());
        return orderStatusRepository.save(orderStatus);
    }

    // ✅ Cập nhật
    public OrderStatus updateOrderStatus(Integer id, OrderStatus updatedStatus) {
        validateStatus(updatedStatus.getStatus());
        updatedStatus.setOrderStatusId(id);
        updatedStatus.setUpdatedAt(LocalDateTime.now());
        return orderStatusRepository.save(updatedStatus);
    }

    // ✅ Xoá
    public void deleteOrderStatus(Integer id) {
        orderStatusRepository.deleteById(id);
    }

    // ===========================
    // ✅ Validate giá trị Status
    private void validateStatus(String status) {
        if (!(status.equals("Chưa chế biến") || status.equals("Đang chế biến") || status.equals("Hoàn thành"))) {
            throw new IllegalArgumentException("Status must be 'Chưa chế biến', 'Đang chế biến', or 'Hoàn thành'");
        }
    }
}
