package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.TopSellingFood;
import com.restaurant.restaurant_backend.service.TopSellingFoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/top-selling-foods")
@RequiredArgsConstructor
public class TopSellingFoodController {

    private final TopSellingFoodService topSellingFoodService;

    // ✅ Lấy danh sách Top Selling theo ngày
    @GetMapping
    public ResponseEntity<List<TopSellingFood>> getByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(topSellingFoodService.getTopSellingByDate(date));
    }

    // ✅ Tạo hoặc cập nhật Top Selling cho 1 món ăn ngày đó
    @PostMapping
    public ResponseEntity<?> generateOrUpdate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam Integer foodId,
            @RequestParam Integer totalSold
    ) {
        try {
            TopSellingFood top = topSellingFoodService.generateOrUpdateTopSelling(date, foodId, totalSold);
            return ResponseEntity.status(201).body(top);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body("Lỗi: " + ex.getMessage());
        }
    }

    // ✅ Xoá nếu thật sự cần
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        try {
            topSellingFoodService.deleteTopSelling(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body("Lỗi: " + ex.getMessage());
        }
    }
}
