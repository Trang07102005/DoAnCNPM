package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.dto.InventoryDTO;
import com.restaurant.restaurant_backend.model.Inventory;
import com.restaurant.restaurant_backend.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventories")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    // ✅ GET all — với cảnh báo
    @GetMapping
    public ResponseEntity<List<InventoryDTO>> getAllInventories() {
        return ResponseEntity.ok(inventoryService.getAllInventoryWithAlert());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getInventoryById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(inventoryService.getInventoryById(id));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body("Lỗi: " + ex.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createInventory(@RequestBody Inventory inventory) {
        try {
            Inventory created = inventoryService.createInventory(inventory);
            return ResponseEntity.status(201).body(created);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body("Lỗi: " + ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateInventory(@PathVariable Integer id, @RequestBody Inventory inventory) {
        try {
            Inventory updated = inventoryService.updateInventory(id, inventory);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body("Lỗi: " + ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInventory(@PathVariable Integer id) {
        try {
            inventoryService.deleteInventory(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body("Lỗi: " + ex.getMessage());
        }
    }
}
