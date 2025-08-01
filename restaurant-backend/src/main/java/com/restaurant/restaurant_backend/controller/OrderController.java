package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.dto.CreateOrderRequest;
import com.restaurant.restaurant_backend.dto.MonthlyRevenueDTO;
import com.restaurant.restaurant_backend.dto.OrderDTO;
import com.restaurant.restaurant_backend.dto.OrderDetailDTO;
import com.restaurant.restaurant_backend.dto.OrderDetailRequest;
import com.restaurant.restaurant_backend.model.*;
import com.restaurant.restaurant_backend.repository.*;
import com.restaurant.restaurant_backend.service.OrderService;

import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
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
    private final OrderService orderService;
    private final OrderDetailRepository orderDetailRepository;
    private final OrderStatusRepository orderStatusRepository;

    // ✅ Lấy tất cả order (ROLE_STAFF + ROLE_CASHIER)
    @PreAuthorize("hasAnyAuthority('ROLE_STAFF', 'ROLE_CASHIER')")
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderDTO> dtos = orders.stream().map(this::convertToDTO).toList();
        return ResponseEntity.ok(dtos);
    }

    // ✅ Lấy order theo bàn
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @GetMapping("/by-table/{tableId}")
    public ResponseEntity<List<OrderDTO>> getOrdersByTable(@PathVariable Integer tableId) {
        List<Order> orders = orderRepository.findByRestaurantTable_TableId(tableId);
        List<OrderDTO> dtos = orders.stream().map(this::convertToDTO).toList();
        return ResponseEntity.ok(dtos);
    }

    // ✅ Lấy order theo trạng thái (ROLE_STAFF + ROLE_CASHIER)
    @PreAuthorize("hasAnyAuthority('ROLE_STAFF', 'ROLE_CASHIER')")
    @GetMapping("/by-status/{status}")
    public ResponseEntity<List<OrderDTO>> getOrdersByStatus(@PathVariable String status) {
        List<Order> orders = orderRepository.findByStatus(status);
        List<OrderDTO> dtos = orders.stream().map(this::convertToDTO).toList();
        return ResponseEntity.ok(dtos);
    }

    // ✅ Lấy order theo người tạo
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @GetMapping("/by-user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Integer userId) {
        return orderRepository.findByCreatedBy_UserId(userId);
    }

    // ✅ Lấy order theo khoảng thời gian
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    @GetMapping("/by-time")
    public List<Order> getOrdersByTime(@RequestParam String start, @RequestParam String end) {
        LocalDateTime startTime = LocalDateTime.parse(start);
        LocalDateTime endTime = LocalDateTime.parse(end);
        return orderRepository.findByOrderTimeBetween(startTime, endTime);
    }

    // ✅ Lấy order theo ID (ROLE_STAFF + ROLE_CASHIER)
    @PreAuthorize("hasAnyAuthority('ROLE_STAFF', 'ROLE_CASHIER')")
    @GetMapping("/{orderId}")
        public ResponseEntity<?> getOrderById(@PathVariable Integer orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
                if (order == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng");
                }

            OrderDTO dto = convertToDTO(order);
            return ResponseEntity.ok(dto);
    }   


    // ✅ Tạo đơn hàng (STAFF)
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
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
            if (food == null) continue;

            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setFood(food);
            detail.setQuantity(detailReq.getQuantity());
            detail.setPrice(detailReq.getPrice());
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

    // ✅ Cập nhật trạng thái đơn hàng (STAFF + CASHIER)
    @PreAuthorize("hasAnyAuthority('ROLE_STAFF', 'ROLE_CASHIER')")
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Integer orderId, @RequestParam String status) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng");
        }

        order.setStatus(status);
        orderRepository.save(order);

        // Trả bàn nếu cần
        RestaurantTable table = order.getRestaurantTable();
        if (table != null && ("Đã thanh toán".equals(status) || "Đã hủy".equals(status))) {
            table.setStatus("Trống");
            tableRepository.save(table);
        }

        return ResponseEntity.ok("Cập nhật trạng thái đơn hàng thành công");
    }

    // ✅ Xoá đơn hàng
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
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
        return ResponseEntity.ok("Xóa đơn hàng thành công");
    }

    // ✅ Convert entity -> DTO
    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setStatus(order.getStatus());
        dto.setOrderTime(order.getOrderTime());
        dto.setTotal(order.getTotal());

        if (order.getRestaurantTable() != null) {
            dto.setTableId(order.getRestaurantTable().getTableId());
        }

        List<OrderDetailDTO> detailDTOs = order.getOrderDetails().stream().map(detail -> {
            OrderDetailDTO d = new OrderDetailDTO();
            d.setOrderDetailId(detail.getOrderDetailId()); // nếu cần id
            d.setFoodId(detail.getFood().getFoodId());
            d.setFoodName(detail.getFood().getFoodName());
            d.setImageUrl(detail.getFood().getImageUrl());

            d.setPrice(detail.getPrice());
            d.setQuantity(detail.getQuantity());

            // 👉 Tính total = price * quantity
        BigDecimal total = detail.getPrice().multiply(BigDecimal.valueOf(detail.getQuantity()));
        d.setTotal(total);

        d.setOrderId(order.getOrderId());
            return d;
        }).toList();

        dto.setOrderDetails(detailDTOs);
        return dto;
    }


        @GetMapping("/revenue/monthly")
        public ResponseEntity<List<MonthlyRevenueDTO>> getMonthlyRevenue() {
            return ResponseEntity.ok(orderService.getMonthlyRevenue());
        }

        @GetMapping("/filter")
public ResponseEntity<List<Order>> filterOrders(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
        @RequestParam(required = false) Integer tableId) {

    List<Order> orders = orderService.filterOrders(status, date);
    return ResponseEntity.ok(orders);
}
}
