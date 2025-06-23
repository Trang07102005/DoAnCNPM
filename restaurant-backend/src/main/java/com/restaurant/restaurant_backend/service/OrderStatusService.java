package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.OrderStatus;
import com.restaurant.restaurant_backend.repository.OrderStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderStatusService {

    private final OrderStatusRepository orderStatusRepository;

    // Lấy tất cả
    public List<OrderStatus> getAllOrderStatuses() {
        return orderStatusRepository.findAll();
    }

    public OrderStatus getOrderStatusById(Integer id) {
        return orderStatusRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái món ăn với ID: " + id));
    }

    public List<OrderStatus> getOrderStatusesByOrderId(Integer orderId) {
        return orderStatusRepository.findByOrder_OrderId(orderId);
    }

    public List<OrderStatus> getOrderStatusesByFoodId(Integer foodId) {
        return orderStatusRepository.findByFood_FoodId(foodId);
    }

    public List<OrderStatus> getOrderStatusesByStatus(String status) {
        return orderStatusRepository.findByStatus(status);
    }

    // Tạo mới: Cho phép tự do
    public OrderStatus createOrderStatus(OrderStatus orderStatus) {
        orderStatus.setOrderStatusId(null);
        if (orderStatus.getStatus() == null || orderStatus.getStatus().isBlank()) {
            orderStatus.setStatus("Chưa chế biến"); // Mặc định
        }
        orderStatus.setUpdatedAt(LocalDateTime.now());
        return orderStatusRepository.save(orderStatus);
    }

    // Cập nhật: Chỉ cho phép nếu trạng thái hiện tại là "Chưa chế biến"
    public OrderStatus updateOrderStatus(Integer id, OrderStatus updated) {
        OrderStatus existing = getOrderStatusById(id);

        if (!"Chưa chế biến".equalsIgnoreCase(existing.getStatus())) {
            throw new RuntimeException("Chỉ được phép chỉnh sửa khi trạng thái món ăn là 'Chưa chế biến'. Trạng thái hiện tại: " + existing.getStatus());
        }

        existing.setStatus(updated.getStatus());
        existing.setUpdatedAt(LocalDateTime.now());

        return orderStatusRepository.save(existing);
    }

    // Xóa: Chỉ cho phép nếu trạng thái là "Chưa chế biến"
    public void deleteOrderStatus(Integer id) {
        OrderStatus existing = getOrderStatusById(id);

        if (!"Chưa chế biến".equalsIgnoreCase(existing.getStatus())) {
            throw new RuntimeException("Chỉ được phép xoá khi trạng thái món ăn là 'Chưa chế biến'. Trạng thái hiện tại: " + existing.getStatus());
        }

        orderStatusRepository.deleteById(id);
    }
}
