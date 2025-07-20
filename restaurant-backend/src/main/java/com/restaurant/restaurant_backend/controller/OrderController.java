package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.dto.CreateOrderRequest;
import com.restaurant.restaurant_backend.dto.OrderDTO;
import com.restaurant.restaurant_backend.dto.OrderDetailDTO;
import com.restaurant.restaurant_backend.dto.OrderDetailRequest;
import com.restaurant.restaurant_backend.model.*;
import com.restaurant.restaurant_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
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

    // ✅ Lấy tất cả order
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
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

    // ✅ Lấy order theo trạng thái
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
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
    public List<Order> getOrdersByTime(
            @RequestParam String start,
            @RequestParam String end) {
        LocalDateTime startTime = LocalDateTime.parse(start);
        LocalDateTime endTime = LocalDateTime.parse(end);
        return orderRepository.findByOrderTimeBetween(startTime, endTime);
    }


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
        int addedCount = 0; // ✅ Đếm số món hợp lệ

        for (OrderDetailRequest detailReq : req.getOrderDetails()) {
            Food food = foodRepository.findById(detailReq.getFoodId()).orElse(null);
            if (food == null) {
                System.err.println("⚠️ Không tìm thấy món ăn với ID: " + detailReq.getFoodId());
                continue;
            }

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
            orderRepository.delete(order); // Xoá order rỗng
            return ResponseEntity.badRequest().body("Không có món ăn hợp lệ trong đơn hàng.");
        }

        order.setTotal(total);
        orderRepository.save(order);

        table.setStatus("Đang phục vụ");
        tableRepository.save(table);

        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }


    // ✅ Cập nhật trạng thái order
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Integer orderId, @RequestParam String status) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng");
        }

        order.setStatus(status);
        orderRepository.save(order);

        // Nếu hoàn thành hoặc hủy -> đổi trạng thái bàn
        if ("Đã thanh toán".equals(status) || "Đã hủy".equals(status)) {
            RestaurantTable table = order.getRestaurantTable();
            table.setStatus("Trống");
            tableRepository.save(table);
        }

        return ResponseEntity.ok("Cập nhật trạng thái đơn hàng thành công");
    }

    // ✅ Xóa order (tuỳ mục đích)
    @PreAuthorize("hasAuthority('ROLE_STAFF')")
    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable Integer orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng");
        }

        // Xóa chi tiết đơn hàng + trạng thái món
        orderDetailRepository.deleteAll(order.getOrderDetails());
        orderStatusRepository.deleteAll(order.getOrderStatuses());

        // Đổi trạng thái bàn nếu cần
        RestaurantTable table = order.getRestaurantTable();
        if (table != null && "Đang phục vụ".equals(table.getStatus())) {
            table.setStatus("Trống");
            tableRepository.save(table);
        }

        orderRepository.delete(order);
        return ResponseEntity.ok("Xóa đơn hàng thành công");
    }

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
        d.setFoodId(detail.getFood().getFoodId());
        d.setFoodName(detail.getFood().getFoodName());
        d.setPrice(detail.getPrice());
        d.setQuantity(detail.getQuantity());
        return d;
    }).toList();

    dto.setOrderDetails(detailDTOs);
    return dto;
}

}
