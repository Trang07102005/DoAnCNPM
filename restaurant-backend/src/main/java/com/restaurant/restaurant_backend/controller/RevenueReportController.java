package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.RevenueReport;
import com.restaurant.restaurant_backend.service.RevenueReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/revenue-reports")
@RequiredArgsConstructor
public class RevenueReportController {

    private final RevenueReportService reportService;

    // ✅ Lấy tất cả báo cáo
    @GetMapping
    public ResponseEntity<List<RevenueReport>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    // ✅ Lấy báo cáo theo ngày
    @GetMapping("/{date}")
    public ResponseEntity<?> getReportByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            return ResponseEntity.ok(reportService.getReportByDate(date));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body("Lỗi: " + ex.getMessage());
        }
    }

    // ✅ Tạo mới hoặc cập nhật báo cáo
    @PostMapping
    public ResponseEntity<?> generateOrUpdateReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam BigDecimal totalRevenue,
            @RequestParam Integer totalOrders
    ) {
        try {
            RevenueReport report = reportService.generateOrUpdateReport(date, totalRevenue, totalOrders);
            return ResponseEntity.status(201).body(report);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body("Lỗi: " + ex.getMessage());
        }
    }

    // ✅ Xóa báo cáo
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReport(@PathVariable Integer id) {
        try {
            reportService.deleteReport(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body("Lỗi: " + ex.getMessage());
        }
    }
}
