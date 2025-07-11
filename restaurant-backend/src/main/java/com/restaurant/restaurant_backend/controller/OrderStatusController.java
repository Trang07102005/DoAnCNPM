package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.dto.PendingDishDTO;
import com.restaurant.restaurant_backend.model.*;
import com.restaurant.restaurant_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/order-status")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderStatusController {

    private final OrderStatusRepository orderStatusRepository;

    // ✅ Lấy danh sách món chưa chế biến
    @GetMapping("/pending")
    public List<PendingDishDTO> getPendingDishes() {
    return orderStatusRepository.findByStatus("Chưa chế biến").stream()
        .map(os -> new PendingDishDTO(
            os.getOrderStatusId(),
            os.getFood().getFoodName(),
            os.getOrder().getOrderId(),
            os.getStatus(),
            os.getUpdatedAt()
        ))
        .toList();
    }


    // ✅ Cập nhật trạng thái món ăn
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDishStatus(@PathVariable Integer id, @RequestParam String status) {
        OrderStatus os = orderStatusRepository.findById(id).orElse(null);
        if (os == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy món trong đơn");
        }

        os.setStatus(status);
        os.setUpdatedAt(LocalDateTime.now());
        orderStatusRepository.save(os);

        return ResponseEntity.ok("Cập nhật trạng thái thành công");
    }
}
