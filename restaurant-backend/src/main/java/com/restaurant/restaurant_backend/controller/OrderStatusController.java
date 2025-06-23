package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.OrderStatus;
import com.restaurant.restaurant_backend.service.OrderStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-statuses")
@RequiredArgsConstructor
public class OrderStatusController {

    private final OrderStatusService orderStatusService;

    // GET: Lấy tất cả trạng thái món ăn
    @GetMapping
    public List<OrderStatus> getAllOrderStatuses() {
        return orderStatusService.getAllOrderStatuses();
    }

    // GET: Lấy theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderStatusById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(orderStatusService.getOrderStatusById(id));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lỗi: " + ex.getMessage());
        }
    }

    // GET: Lấy theo Order ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderStatus>> getOrderStatusesByOrderId(@PathVariable Integer orderId) {
        return ResponseEntity.ok(orderStatusService.getOrderStatusesByOrderId(orderId));
    }

    // GET: Lấy theo Food ID
    @GetMapping("/food/{foodId}")
    public ResponseEntity<List<OrderStatus>> getOrderStatusesByFoodId(@PathVariable Integer foodId) {
        return ResponseEntity.ok(orderStatusService.getOrderStatusesByFoodId(foodId));
    }

    // GET: Lấy theo Status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderStatus>> getOrderStatusesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(orderStatusService.getOrderStatusesByStatus(status));
    }

    // POST: Tạo mới
    @PostMapping
    public ResponseEntity<?> createOrderStatus(@RequestBody OrderStatus orderStatus) {
        try {
            OrderStatus created = orderStatusService.createOrderStatus(orderStatus);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + ex.getMessage());
        }
    }

    // PUT: Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Integer id, @RequestBody OrderStatus orderStatus) {
        try {
            OrderStatus updated = orderStatusService.updateOrderStatus(id, orderStatus);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + ex.getMessage());
        }
    }

    // DELETE: Xoá
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrderStatus(@PathVariable Integer id) {
        try {
            orderStatusService.deleteOrderStatus(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + ex.getMessage());
        }
    }
}
