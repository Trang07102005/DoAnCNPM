package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.dto.CreateOrderRequest;
import com.restaurant.restaurant_backend.dto.OrderDetailRequest;
import com.restaurant.restaurant_backend.model.*;
import com.restaurant.restaurant_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final RestaurantTableRepository tableRepository;
    private final FoodRepository foodRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final OrderStatusRepository orderStatusRepository;

    // ✅ Lấy tất cả đơn hàng
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // ✅ Lấy đơn theo bàn
    @GetMapping("/by-table/{tableId}")
    public List<Order> getOrdersByTable(@PathVariable Integer tableId) {
        return orderRepository.findByRestaurantTable_TableId(tableId);
    }

    // ✅ Lấy đơn theo trạng thái
    @GetMapping("/by-status/{status}")
    public List<Order> getOrdersByStatus(@PathVariable String status) {
        return orderRepository.findByStatus(status);
    }

    // ✅ Lấy đơn theo người tạo
    @GetMapping("/by-user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Integer userId) {
        return orderRepository.findByCreatedBy_UserId(userId);
    }

    // ✅ Lấy đơn theo khoảng thời gian
    @GetMapping("/by-time")
    public List<Order> getOrdersByTime(
            @RequestParam String start,
            @RequestParam String end) {
        LocalDateTime startTime = LocalDateTime.parse(start);
        LocalDateTime endTime = LocalDateTime.parse(end);
        return orderRepository.findByOrderTimeBetween(startTime, endTime);
    }

    // ✅ Lấy đơn chưa thanh toán (cho bước thanh toán)
    @GetMapping("/unpaid")
    public List<Order> getUnpaidOrders() {
        return orderRepository.findByStatusIn(List.of("Đang xử lý", "Đã hoàn thành"));
    }

    // ✅ Tạo đơn hàng mới
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest req) {
        if (req.getTableId() == null || req.getCreatedById() == null || req.getOrderDetails() == null || req.getOrderDetails().isEmpty()) {
            return ResponseEntity.badRequest().body("Thiếu thông tin bắt buộc");
        }

        RestaurantTable table = tableRepository.findById(req.getTableId()).orElse(null);
        if (table == null || !"Trống".equalsIgnoreCase(table.getStatus())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Bàn không hợp lệ hoặc đã có người ngồi");
        }

        Users createdBy = new Users();
        createdBy.setUserId(req.getCreatedById());

        Order order = new Order();
        order.setRestaurantTable(table);
        order.setCreatedBy(createdBy);
        order.setOrderTime(LocalDateTime.now());
        order.setStatus("Đang xử lý");
        order.setTotal(BigDecimal.ZERO);
        order = orderRepository.save(order);

        BigDecimal total = BigDecimal.ZERO;
        int addedCount = 0;

        for (OrderDetailRequest detailReq : req.getOrderDetails()) {
            Food food = foodRepository.findById(detailReq.getFoodId()).orElse(null);
            if (food == null) {
                System.err.println("⚠️ Không tìm thấy món ăn với ID: " + detailReq.getFoodId());
                continue;
            }

            OrderDetail detail = new OrderDetail(order, food, detailReq.getQuantity(), detailReq.getPrice());
            orderDetailRepository.save(detail);

            OrderStatus status = new OrderStatus();
            status.setOrder(order);
            status.setFood(food);
            status.setStatus("Chưa chế biến");
            status.setUpdatedAt(LocalDateTime.now());
            orderStatusRepository.save(status);

            total = total.add(detail.getPrice().multiply(BigDecimal.valueOf(detail.getQuantity())));
            addedCount++;
        }

        if (addedCount == 0) {
            orderRepository.delete(order);
            return ResponseEntity.badRequest().body("Không có món ăn hợp lệ trong đơn hàng.");
        }

        order.setTotal(total);
        orderRepository.save(order);

        table.setStatus("Đang phục vụ");
        tableRepository.save(table);

        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    // ✅ Cập nhật trạng thái đơn hàng
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Integer orderId, @RequestParam String status) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng");
        }

        order.setStatus(status);
        orderRepository.save(order);

        if ("Đã thanh toán".equals(status) || "Đã hủy".equals(status)) {
            RestaurantTable table = order.getRestaurantTable();
            table.setStatus("Trống");
            tableRepository.save(table);
        }

        return ResponseEntity.ok("Cập nhật trạng thái đơn hàng thành công");
    }

    // ✅ Xoá đơn hàng
    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable Integer orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng");
        }

        orderDetailRepository.deleteAll(order.getOrderDetails());
        orderStatusRepository.deleteAll(order.getOrderStatuses());

        RestaurantTable table = order.getRestaurantTable();
        if (table != null && "Đang phục vụ".equals(table.getStatus())) {
            table.setStatus("Trống");
            tableRepository.save(table);
        }

        orderRepository.delete(order);
        return ResponseEntity.ok("Xoá đơn hàng thành công");
    }
    
}
