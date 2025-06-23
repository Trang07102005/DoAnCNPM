package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.RestaurantTable;
import com.restaurant.restaurant_backend.service.RestaurantTableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class RestaurantTableController {

    private final RestaurantTableService restaurantTableService;

    @GetMapping
    public ResponseEntity<List<RestaurantTable>> getAllTables() {
        return ResponseEntity.ok(restaurantTableService.getAllTables());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<RestaurantTable>> getTablesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(restaurantTableService.getTablesByStatus(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantTable> getTableById(@PathVariable Integer id) {
        return restaurantTableService.getTableById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RestaurantTable> createTable(@RequestBody RestaurantTable table) {
        return ResponseEntity.ok(restaurantTableService.createTable(table));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RestaurantTable> updateTable(@PathVariable Integer id,
                                                       @RequestBody RestaurantTable updatedTable) {
        return ResponseEntity.ok(restaurantTableService.updateTable(id, updatedTable));
    }

    // 🚫 KHÔNG CÓ DELETE ENDPOINT
}
