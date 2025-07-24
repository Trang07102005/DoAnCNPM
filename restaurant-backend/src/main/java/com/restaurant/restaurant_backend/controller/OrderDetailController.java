package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.dto.OrderDetailDTO;
import com.restaurant.restaurant_backend.dto.OrderDetailRequest;
import com.restaurant.restaurant_backend.model.Food;
import com.restaurant.restaurant_backend.model.Order;
import com.restaurant.restaurant_backend.model.OrderDetail;
import com.restaurant.restaurant_backend.repository.FoodRepository;
import com.restaurant.restaurant_backend.repository.OrderDetailRepository;
import com.restaurant.restaurant_backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/order-details")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderDetailController {

    private final OrderDetailRepository orderDetailRepository;
    private final OrderRepository orderRepository; // ✅ THÊM DÒNG NÀY
    private final FoodRepository foodRepository;

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

        recalculateOrderTotal(order); // ✅ GỌI lại hàm đã viết
        orderRepository.save(order); // Cập nhật tổng tiền đơn hàng

        return ResponseEntity.ok("Đã xoá món trong đơn và cập nhật tổng tiền");
    }

    public void recalculateOrderTotal(Order order) {
        List<OrderDetail> details = orderDetailRepository.findByOrder(order);
        BigDecimal total = BigDecimal.ZERO;
        for (OrderDetail detail : details) {
            BigDecimal subtotal = detail.getFood().getPrice().multiply(BigDecimal.valueOf(detail.getQuantity()));
            total = total.add(subtotal);
        }
        order.setTotal(total);                  // ✅ Cập nhật lại total
        orderRepository.save(order);           // ✅ Lưu thay đổi
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
            detail.setPrice(food.getPrice()); // lấy giá tại thời điểm gọi
            orderDetailRepository.save(detail);
        }

        // ✅ Recalculate order total
        recalculateOrderTotal(order);

        return ResponseEntity.ok("Thêm món và cập nhật tổng tiền thành công");
    }

}
