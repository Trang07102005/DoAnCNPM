package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.InventoryTransaction;
import com.restaurant.restaurant_backend.service.InventoryTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/inventory-transactions")
@RequiredArgsConstructor
public class InventoryTransactionController {

    private final InventoryTransactionService transactionService;

    // Lấy tất cả
    @GetMapping
    public ResponseEntity<List<InventoryTransaction>> getAll() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    // Lọc theo loại
    @GetMapping("/type/{type}")
    public ResponseEntity<List<InventoryTransaction>> getByType(@PathVariable String type) {
        return ResponseEntity.ok(transactionService.getTransactionsByType(type));
    }

    // Lọc theo khoảng thời gian
    @GetMapping("/range")
    public ResponseEntity<List<InventoryTransaction>> getByRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return ResponseEntity.ok(transactionService.getTransactionsByDateRange(from, to));
    }

    // Tạo giao dịch nhập / xuất kho
    @PostMapping
    public ResponseEntity<?> create(@RequestBody InventoryTransaction transaction) {
        try {
            InventoryTransaction created = transactionService.createTransaction(transaction);
            return ResponseEntity.status(201).body(created);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body("Lỗi: " + ex.getMessage());
        }
    }
}
