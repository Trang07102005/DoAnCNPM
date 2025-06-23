package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.OrderDetail;
import com.restaurant.restaurant_backend.service.OrderDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
@RequiredArgsConstructor
public class OrderDetailController {

    private final OrderDetailService orderDetailService;

    /**
     * GET: Lấy tất cả chi tiết đơn hàng.
     */
    @GetMapping
    public List<OrderDetail> getAllOrderDetails() {
        return orderDetailService.getAllOrderDetails();
    }

    /**
     * GET: Lấy chi tiết đơn hàng theo ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderDetailById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(orderDetailService.getOrderDetailById(id));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Lỗi: " + ex.getMessage());
        }
    }

    /**
     * GET: Lấy chi tiết theo Order ID.
     */
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderDetail>> getOrderDetailsByOrderId(@PathVariable Integer orderId) {
        return ResponseEntity.ok(orderDetailService.getOrderDetailsByOrderId(orderId));
    }

    /**
     * GET: Lấy chi tiết theo Food ID.
     */
    @GetMapping("/food/{foodId}")
    public ResponseEntity<List<OrderDetail>> getOrderDetailsByFoodId(@PathVariable Integer foodId) {
        return ResponseEntity.ok(orderDetailService.getOrderDetailsByFoodId(foodId));
    }

    /**
     * POST: Thêm mới chi tiết đơn hàng.
     */
    @PostMapping
    public ResponseEntity<?> createOrderDetail(@RequestBody OrderDetail orderDetail) {
        try {
            OrderDetail created = orderDetailService.createOrderDetail(orderDetail);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + ex.getMessage());
        }
    }

    /**
     * PUT: Cập nhật chi tiết đơn hàng.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrderDetail(@PathVariable Integer id, @RequestBody OrderDetail orderDetail) {
        try {
            OrderDetail updated = orderDetailService.updateOrderDetail(id, orderDetail);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + ex.getMessage());
        }
    }

    /**
     * DELETE: Xoá chi tiết đơn hàng.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrderDetail(@PathVariable Integer id) {
        try {
            orderDetailService.deleteOrderDetail(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " + ex.getMessage());
        }
    }
}
