package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.RestaurantTable;
import com.restaurant.restaurant_backend.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RestaurantTableService {

    private final RestaurantTableRepository restaurantTableRepository;

    // Lấy tất cả bàn
    public List<RestaurantTable> getAllTables() {
        return restaurantTableRepository.findAll();
    }

    // Lấy bàn theo trạng thái
    public List<RestaurantTable> getTablesByStatus(String status) {
        return restaurantTableRepository.findByStatus(status);
    }

    // Lấy bàn theo ID
    public Optional<RestaurantTable> getTableById(Integer id) {
        return restaurantTableRepository.findById(id);
    }

    // Tạo bàn mới
    public RestaurantTable createTable(RestaurantTable table) {
        table.setStatus("Trống");
        return restaurantTableRepository.save(table);
    }

    // Cập nhật bàn
    public RestaurantTable updateTable(Integer id, RestaurantTable updatedTable) {
        return restaurantTableRepository.findById(id).map(table -> {
            table.setTableName(updatedTable.getTableName());
            table.setStatus(updatedTable.getStatus());
            return restaurantTableRepository.save(table);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy bàn!"));
    }

    // 🚫 KHÔNG có deleteTable
}
