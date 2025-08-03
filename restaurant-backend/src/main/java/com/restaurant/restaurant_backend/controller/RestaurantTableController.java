package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.RestaurantTable;
import com.restaurant.restaurant_backend.repository.RestaurantTableRepository;
import com.restaurant.restaurant_backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tables")
@CrossOrigin(origins = "http://localhost:5173") // frontend
@RequiredArgsConstructor
public class RestaurantTableController {

    private final RestaurantTableRepository tableRepository;
    private final ReservationRepository reservationRepository;

    // Lấy danh sách bàn
    @GetMapping
    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    // Tạo bàn mới
    @PostMapping
    public ResponseEntity<?> createTable(@RequestBody RestaurantTable table) {
        if (table.getTableName() == null || table.getTableName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Tên bàn không được để trống");
        }

        boolean exists = tableRepository.findByTableName(table.getTableName().trim()).isPresent();
        if (exists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Tên bàn đã tồn tại");
        }

        table.setStatus("Trống"); // Mặc định khi tạo
        RestaurantTable saved = tableRepository.save(table);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Sửa bàn
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTable(@PathVariable Integer id, @RequestBody RestaurantTable req) {
        RestaurantTable table = tableRepository.findById(id)
                .orElse(null);
        if (table == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy bàn");
        }

        if (req.getTableName() != null && !req.getTableName().trim().isEmpty()) {
            // Check trùng tên với bàn khác
            boolean nameExists = tableRepository.findByTableName(req.getTableName().trim())
                    .filter(t -> !t.getTableId().equals(id))
                    .isPresent();
            if (nameExists) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Tên bàn đã tồn tại");
            }
            table.setTableName(req.getTableName().trim());
        }

        if (req.getStatus() != null) {
            table.setStatus(req.getStatus());
        }

        RestaurantTable updated = tableRepository.save(table);
        return ResponseEntity.ok(updated);
    }

    // Xóa bàn
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTable(@PathVariable Integer id) {
        if (!tableRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy bàn");
        }

        // Check xem bàn có reservation không
        if (reservationRepository.existsByRestaurantTable_TableId(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Không thể xóa: Bàn đã có lịch đặt");
        }

        tableRepository.deleteById(id);
        return ResponseEntity.ok("Xóa bàn thành công");
    }
    @GetMapping("/available-now")
    public List<RestaurantTable> getAvailableTablesNow() {
    // Lọc theo status "Trống"
    return tableRepository.findByStatus("Trống");
    }
    @GetMapping("/with-status")
public List<RestaurantTable> getTablesWithRealTimeStatus() {
    List<RestaurantTable> tables = tableRepository.findAll();
    LocalDateTime now = LocalDateTime.now();

    for (RestaurantTable table : tables) {
        // Nếu bàn đang phục vụ thì giữ nguyên trạng thái
        if ("Đang phục vụ".equalsIgnoreCase(table.getStatus())) {
            continue;
        }

        boolean hasActiveReservation = reservationRepository
            .findByRestaurantTable_TableId(table.getTableId())
            .stream()
            .anyMatch(r -> {
                if (!"Đã đặt".equalsIgnoreCase(r.getStatus())) return false;

                LocalDateTime resTime = r.getReservationTime();
                LocalDateTime start = resTime.minusMinutes(90);
                LocalDateTime end = resTime.plusMinutes(90);

                return !now.isBefore(start) && !now.isAfter(end); // nằm trong khoảng đặt
            });

        table.setStatus(hasActiveReservation ? "Đã đặt" : "Trống");
    }

    return tables;
}

    @GetMapping("/serving")
public ResponseEntity<List<RestaurantTable>> getTablesBeingServed() {
    List<RestaurantTable> servingTables = tableRepository.findByStatus("Đang phục vụ");
    return ResponseEntity.ok(servingTables);
}
    

}