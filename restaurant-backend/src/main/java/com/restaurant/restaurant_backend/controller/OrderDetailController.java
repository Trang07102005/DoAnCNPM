package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.dto.OrderDetailDTO;
import com.restaurant.restaurant_backend.dto.OrderDetailRequest;
import com.restaurant.restaurant_backend.model.Food;
import com.restaurant.restaurant_backend.model.Order;
import com.restaurant.restaurant_backend.model.OrderDetail;
import com.restaurant.restaurant_backend.model.OrderStatus;
import com.restaurant.restaurant_backend.repository.FoodRepository;
import com.restaurant.restaurant_backend.repository.OrderDetailRepository;
import com.restaurant.restaurant_backend.repository.OrderRepository;
import com.restaurant.restaurant_backend.repository.OrderStatusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/order-details")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderDetailController {

    private final OrderDetailRepository orderDetailRepository;
    private final OrderRepository orderRepository;
    private final FoodRepository foodRepository;
    private final OrderStatusRepository orderStatusRepository; // Thêm repository

    @GetMapping("/by-order/{orderId}")
    public ResponseEntity<List<OrderDetailDTO>> getDetailsByOrder(@PathVariable Integer orderId) {
        List<OrderDetail> details = orderDetailRepository.findByOrder_OrderId(orderId);
        List<OrderDetailDTO> dtoList = details.stream().map(detail -> {
            OrderDetailDTO dto = new OrderDetailDTO();
            dto.setOrderDetailId(detail.getOrderDetailId());
            dto.setFoodId(detail.getFood().getFoodId());
            dto.setFoodName(detail.getFood().getFoodName());
            dto.setPrice(detail.getPrice());
            dto.setQuantity(detail.getQuantity());
            dto.setImageUrl(detail.getFood().getImageUrl());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }

    @PutMapping("/{id}/quantity")
    public ResponseEntity<?> updateQuantity(@PathVariable Integer id, @RequestParam Integer quantity) {
        OrderDetail detail = orderDetailRepository.findById(id).orElse(null);
        if (detail == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy món trong đơn");
        }

        detail.setQuantity(quantity);
        orderDetailRepository.save(detail);

        Order order = detail.getOrder();
        recalculateOrderTotal(order);

        return ResponseEntity.ok("Cập nhật số lượng và tổng tiền thành công");
    }
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDetail(@PathVariable Integer id) {
        OrderDetail detail = orderDetailRepository.findById(id).orElse(null);
        if (detail == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy món trong đơn");
        }

        Order order = detail.getOrder();
        Integer foodId = detail.getFood().getFoodId();

        // ✅ Xóa trạng thái món ăn trước
        orderStatusRepository.deleteByOrder_OrderIdAndFood_FoodId(order.getOrderId(), foodId);

        // ✅ Xóa món trong đơn
        orderDetailRepository.delete(detail);

        // ✅ Cập nhật lại tổng tiền
        recalculateOrderTotal(order);

        return ResponseEntity.ok("Đã xoá món và cập nhật tổng tiền");
    }

    public void recalculateOrderTotal(Order order) {
        List<OrderDetail> details = orderDetailRepository.findByOrder(order);
        BigDecimal total = BigDecimal.ZERO;
        for (OrderDetail detail : details) {
            BigDecimal subtotal = detail.getFood().getPrice().multiply(BigDecimal.valueOf(detail.getQuantity()));
            total = total.add(subtotal);
        }
        order.setTotal(total);
        orderRepository.save(order);
    }

    @PostMapping
    public ResponseEntity<?> addFoodToOrder(@RequestBody OrderDetailRequest req) {
        if (req.getOrderId() == null || req.getFoodId() == null || req.getQuantity() == null || req.getQuantity() < 1) {
            return ResponseEntity.badRequest().body("Thông tin không hợp lệ");
        }

        Order order = orderRepository.findById(req.getOrderId()).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đơn hàng");
        }

        Food food = foodRepository.findById(req.getFoodId()).orElse(null);
        if (food == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy món ăn");
        }

        // Kiểm tra nếu món đã tồn tại trong order -> cộng dồn
        OrderDetail existingDetail = orderDetailRepository
            .findByOrder_OrderId(order.getOrderId())
            .stream()
            .filter(d -> d.getFood().getFoodId().equals(food.getFoodId()))
            .findFirst()
            .orElse(null);

        if (existingDetail != null) {
            existingDetail.setQuantity(existingDetail.getQuantity() + req.getQuantity());
            orderDetailRepository.save(existingDetail);
        } else {
            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setFood(food);
            detail.setQuantity(req.getQuantity());
            detail.setPrice(food.getPrice());
            orderDetailRepository.save(detail);

            // Thêm bản ghi order_status
            OrderStatus status = new OrderStatus();
            status.setOrder(order);
            status.setFood(food);
            status.setStatus("Chưa chế biến");
            status.setUpdatedAt(LocalDateTime.now());
            orderStatusRepository.save(status);
        }

        recalculateOrderTotal(order);

        return ResponseEntity.ok("Thêm món và cập nhật tổng tiền thành công");
    }
}