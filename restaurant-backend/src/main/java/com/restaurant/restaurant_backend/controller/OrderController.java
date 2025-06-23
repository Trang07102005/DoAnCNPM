package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.Order;
import com.restaurant.restaurant_backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // ✅ Lấy tất cả đơn hàng
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // ✅ Lấy đơn hàng theo ID
    @GetMapping("/{orderId}")
    public Optional<Order> getOrderById(@PathVariable Integer orderId) {
        return orderService.getOrderById(orderId);
    }

    // ✅ Tạo mới đơn hàng
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    // ✅ Cập nhật đơn hàng
    @PutMapping("/{orderId}")
    public Order updateOrder(@PathVariable Integer orderId, @RequestBody Order updatedOrder) {
        return orderService.updateOrder(orderId, updatedOrder);
    }

    // ❌ XÓA VĨNH VIỄN (khuyến cáo không dùng, chỉ để test)
    @DeleteMapping("/{orderId}")
    public void deleteOrder(@PathVariable Integer orderId) {
        orderService.deleteOrder(orderId);
    }

    // ✅ XÓA MỀM (HUỶ ĐƠN HÀNG) -> An toàn hơn
    @PutMapping("/{orderId}/cancel")
    public Order cancelOrder(@PathVariable Integer orderId) {
        return orderService.cancelOrder(orderId);
    }

    // ✅ Lọc theo trạng thái
    @GetMapping("/status/{status}")
    public List<Order> getOrdersByStatus(@PathVariable String status) {
        return orderService.getOrdersByStatus(status);
    }

    // ✅ Lọc theo thời gian
    @GetMapping("/time")
    public List<Order> getOrdersByTime(@RequestParam LocalDateTime startTime, @RequestParam LocalDateTime endTime) {
        return orderService.getOrdersByOrderTimeBetween(startTime, endTime);
    }

    // ✅ Lọc theo người tạo
    @GetMapping("/createdBy/{userId}")
    public List<Order> getOrdersByCreatedByUserId(@PathVariable Integer userId) {
        return orderService.getOrdersByCreatedByUserId(userId);
    }

    // ✅ Lọc theo bàn
    @GetMapping("/table/{tableId}")
    public List<Order> getOrdersByTable(@PathVariable Integer tableId) {
        return orderService.getOrdersByRestaurantTableTableId(tableId);
    }
}
