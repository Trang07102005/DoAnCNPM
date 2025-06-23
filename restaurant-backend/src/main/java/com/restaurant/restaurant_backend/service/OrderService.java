package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.Order;
import com.restaurant.restaurant_backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Integer orderId) {
        return orderRepository.findById(orderId);
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order updateOrder(Integer orderId, Order updatedOrder) {
        updatedOrder.setOrderId(orderId); // Đảm bảo không đổi ID
        return orderRepository.save(updatedOrder);
    }

    // ❌ XÓA VĨNH VIỄN (nên hạn chế)
    public void deleteOrder(Integer orderId) {
        orderRepository.deleteById(orderId);
    }

    // ✅ XÓA MỀM: Đổi trạng thái thành "Đã hủy"
    public Order cancelOrder(Integer orderId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            order.setStatus("Đã hủy");
            return orderRepository.save(order);
        } else {
            throw new RuntimeException("Order not found with ID: " + orderId);
        }
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    public List<Order> getOrdersByOrderTimeBetween(LocalDateTime startTime, LocalDateTime endTime) {
        return orderRepository.findByOrderTimeBetween(startTime, endTime);
    }

    public List<Order> getOrdersByCreatedByUserId(Integer userId) {
        return orderRepository.findByCreatedBy_UserId(userId);
    }

    public List<Order> getOrdersByRestaurantTableTableId(Integer tableId) {
        return orderRepository.findByRestaurantTable_TableId(tableId);
    }
}
