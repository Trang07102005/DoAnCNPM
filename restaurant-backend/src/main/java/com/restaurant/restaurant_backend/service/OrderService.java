package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.Order;
import com.restaurant.restaurant_backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    // Lấy tất cả đơn hàng
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Lấy đơn theo ID
    public Order getOrderById(Integer id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + id));
    }

    // Tìm theo bàn
    public List<Order> getOrdersByTableId(Integer tableId) {
        return orderRepository.findByRestaurantTable_TableId(tableId);
    }

    // Tìm theo trạng thái
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    // Tìm theo khoảng thời gian
    public List<Order> getOrdersBetween(LocalDateTime startTime, LocalDateTime endTime) {
        return orderRepository.findByOrderTimeBetween(startTime, endTime);
    }

    // Tìm theo người tạo
    public List<Order> getOrdersByUserId(Integer userId) {
        return orderRepository.findByCreatedBy_UserId(userId);
    }

    // Tạo đơn hàng mới
    public Order createOrder(Order order) {
        order.setOrderId(null);
        order.setOrderTime(LocalDateTime.now());
        order.setStatus("Chờ xác nhận");
        return orderRepository.save(order);
    }

    // Cập nhật đơn hàng — Chỉ khi đang chờ xác nhận
    public Order updateOrder(Integer id, Order updated) {
        Order existing = getOrderById(id);

        if (!"Chờ xác nhận".equalsIgnoreCase(existing.getStatus())) {
            throw new RuntimeException("Chỉ được chỉnh sửa đơn hàng đang ở trạng thái 'Chờ xác nhận'. Đơn hiện tại đang ở trạng thái: " + existing.getStatus());
        }

        // Cho phép chỉnh sửa các thông tin này:
        existing.setRestaurantTable(updated.getRestaurantTable());
        existing.setTotal(updated.getTotal());
        existing.setOrderDetails(updated.getOrderDetails());
        // Không cho sửa: createdBy, orderTime, status ở đây

        return orderRepository.save(existing);
    }

    // Xoá đơn hàng
    public void deleteOrder(Integer id) {
        Order existing = getOrderById(id);

        if (!"Chờ xác nhận".equalsIgnoreCase(existing.getStatus())) {
            throw new RuntimeException("Chỉ được xoá đơn hàng khi ở trạng thái 'Chờ xác nhận'. Đơn hiện tại đang ở trạng thái: " + existing.getStatus());
        }

        orderRepository.deleteById(id);
    }
}
