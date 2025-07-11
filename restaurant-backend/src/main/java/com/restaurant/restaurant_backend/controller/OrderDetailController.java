package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.Order;
import com.restaurant.restaurant_backend.model.OrderDetail;
import com.restaurant.restaurant_backend.repository.OrderDetailRepository;
import com.restaurant.restaurant_backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/order-details")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderDetailController {

    private final OrderDetailRepository orderDetailRepository;
    private final OrderRepository orderRepository; // ✅ THÊM DÒNG NÀY

    // ✅ Lấy danh sách món trong một đơn
    @GetMapping("/by-order/{orderId}")
    public List<OrderDetail> getDetailsByOrder(@PathVariable Integer orderId) {
        return orderDetailRepository.findByOrder_OrderId(orderId);
    }

    // ✅ Cập nhật số lượng món trong đơn và cập nhật tổng tiền
    @PutMapping("/{id}/quantity")
    public ResponseEntity<?> updateQuantity(@PathVariable Integer id, @RequestParam Integer quantity) {
        OrderDetail detail = orderDetailRepository.findById(id).orElse(null);
        if (detail == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy món trong đơn");
        }

        detail.setQuantity(quantity);
        orderDetailRepository.save(detail);

        // ✅ Cập nhật lại tổng tiền đơn hàng
        Order order = detail.getOrder();
        BigDecimal newTotal = order.getOrderDetails().stream()
            .map(d -> d.getPrice().multiply(BigDecimal.valueOf(d.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotal(newTotal);
        orderRepository.save(order);

        return ResponseEntity.ok("Cập nhật số lượng và tổng tiền thành công");
    }

    // ✅ Xoá một món trong đơn
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDetail(@PathVariable Integer id) {
        if (!orderDetailRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy món trong đơn");
        }

        OrderDetail detail = orderDetailRepository.findById(id).orElse(null);
        if (detail == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy món trong đơn");
        }

        Order order = detail.getOrder();
        orderDetailRepository.deleteById(id);

        // ✅ Cập nhật lại tổng tiền sau khi xoá
        BigDecimal newTotal = order.getOrderDetails().stream()
            .filter(d -> !d.getOrderDetailId().equals(id)) // bỏ qua món đã xoá
            .map(d -> d.getPrice().multiply(BigDecimal.valueOf(d.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotal(newTotal);
        orderRepository.save(order);

        return ResponseEntity.ok("Đã xoá món trong đơn và cập nhật tổng tiền");
    }
}
