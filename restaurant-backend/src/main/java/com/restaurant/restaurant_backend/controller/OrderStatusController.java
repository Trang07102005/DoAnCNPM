package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.OrderStatus;
import com.restaurant.restaurant_backend.service.OrderStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/order-statuses")
public class OrderStatusController {

    @Autowired
    private OrderStatusService orderStatusService;

    // ✅ Lấy tất cả
    @GetMapping
    public List<OrderStatus> getAllOrderStatuses() {
        return orderStatusService.getAllOrderStatuses();
    }

    // ✅ Lấy theo ID
    @GetMapping("/{id}")
    public Optional<OrderStatus> getOrderStatusById(@PathVariable Integer id) {
        return orderStatusService.getOrderStatusById(id);
    }

    // ✅ Lấy theo OrderID
    @GetMapping("/order/{orderId}")
    public List<OrderStatus> getOrderStatusesByOrderId(@PathVariable Integer orderId) {
        return orderStatusService.getOrderStatusesByOrderId(orderId);
    }

    // ✅ Lấy theo FoodID
    @GetMapping("/food/{foodId}")
    public List<OrderStatus> getOrderStatusesByFoodId(@PathVariable Integer foodId) {
        return orderStatusService.getOrderStatusesByFoodId(foodId);
    }

    // ✅ Lấy theo Status
    @GetMapping("/status/{status}")
    public List<OrderStatus> getOrderStatusesByStatus(@PathVariable String status) {
        return orderStatusService.getOrderStatusesByStatus(status);
    }

    // ✅ Tạo mới
    @PostMapping
    public OrderStatus createOrderStatus(@RequestBody OrderStatus orderStatus) {
        return orderStatusService.createOrderStatus(orderStatus);
    }

    // ✅ Cập nhật
    @PutMapping("/{id}")
    public OrderStatus updateOrderStatus(@PathVariable Integer id, @RequestBody OrderStatus updatedStatus) {
        return orderStatusService.updateOrderStatus(id, updatedStatus);
    }

    // ✅ Xoá
    @DeleteMapping("/{id}")
    public void deleteOrderStatus(@PathVariable Integer id) {
        orderStatusService.deleteOrderStatus(id);
    }
}
