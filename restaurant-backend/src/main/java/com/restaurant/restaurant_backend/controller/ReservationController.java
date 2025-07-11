package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.Reservation;
import com.restaurant.restaurant_backend.model.RestaurantTable;
import com.restaurant.restaurant_backend.repository.ReservationRepository;
import com.restaurant.restaurant_backend.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final RestaurantTableRepository tableRepository;

    // ✅ Lấy tất cả đặt bàn
    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    // ✅ Tạo đặt bàn
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody Reservation reservation) {
        if (reservation.getCustomerName() == null || reservation.getCustomerName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Tên khách hàng không được để trống");
        }
        if (reservation.getReservationTime() == null) {
            return ResponseEntity.badRequest().body("Thời gian đặt bàn không hợp lệ");
        }
        if (reservation.getRestaurantTable() == null || reservation.getRestaurantTable().getTableId() == null) {
            return ResponseEntity.badRequest().body("Phải chọn bàn");
        }

        Integer tableId = reservation.getRestaurantTable().getTableId();
        LocalDateTime start = reservation.getReservationTime();
        LocalDateTime end = start.plusHours(1);

        boolean exists = reservationRepository
                .findByRestaurantTable_TableIdAndReservationTimeBetween(tableId, start.minusHours(1), end)
                .stream().findAny().isPresent();

        if (exists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Bàn đã có người đặt trong khoảng thời gian này");
        }

        RestaurantTable table = tableRepository.findById(tableId).orElse(null);
        if (table == null) {
            return ResponseEntity.badRequest().body("Không tìm thấy bàn");
        }

        table.setStatus("Đã đặt");
        tableRepository.save(table);

        reservation.setStatus("Đã đặt");
        Reservation savedRes = reservationRepository.save(reservation);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedRes);
    }

    // ✅ Cập nhật thông tin đặt bàn
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReservation(@PathVariable Integer id, @RequestBody Reservation updatedReservation) {
        Reservation existing = reservationRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đặt bàn");
        }

        if (updatedReservation.getCustomerName() == null || updatedReservation.getCustomerName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Tên khách hàng không được để trống");
        }
        if (updatedReservation.getReservationTime() == null) {
            return ResponseEntity.badRequest().body("Thời gian đặt bàn không hợp lệ");
        }
        if (updatedReservation.getRestaurantTable() == null || updatedReservation.getRestaurantTable().getTableId() == null) {
            return ResponseEntity.badRequest().body("Phải chọn bàn");
        }

        Integer newTableId = updatedReservation.getRestaurantTable().getTableId();
        LocalDateTime newStart = updatedReservation.getReservationTime();
        LocalDateTime newEnd = newStart.plusHours(1);

        boolean exists = reservationRepository
                .findByRestaurantTable_TableIdAndReservationTimeBetween(newTableId, newStart.minusHours(1), newEnd)
                .stream()
                .anyMatch(r -> !r.getReservationId().equals(id));

        if (exists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Bàn đã có người đặt trong khoảng thời gian này");
        }

        // Nếu đổi bàn, cập nhật trạng thái bàn
        if (!existing.getRestaurantTable().getTableId().equals(newTableId)) {
            RestaurantTable oldTable = existing.getRestaurantTable();
            oldTable.setStatus("Trống");
            tableRepository.save(oldTable);

            RestaurantTable newTable = tableRepository.findById(newTableId).orElse(null);
            if (newTable == null) {
                return ResponseEntity.badRequest().body("Không tìm thấy bàn mới");
            }
            newTable.setStatus("Đã đặt");
            tableRepository.save(newTable);

            existing.setRestaurantTable(newTable);
        }

        existing.setCustomerName(updatedReservation.getCustomerName().trim());
        existing.setPhone(updatedReservation.getPhone());
        existing.setEmail(updatedReservation.getEmail().trim());
        existing.setNumberOfPeople(updatedReservation.getNumberOfPeople());
        existing.setNote(updatedReservation.getNote());
        existing.setReservationTime(updatedReservation.getReservationTime());

        reservationRepository.save(existing);

        return ResponseEntity.ok("Cập nhật đặt bàn thành công");
    }

    // ✅ Cập nhật trạng thái đặt bàn
    @PutMapping("/status/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id, @RequestBody Map<String, String> req) {
        Reservation resv = reservationRepository.findById(id).orElse(null);
        if (resv == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đặt bàn");
        }

        String status = req.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Trạng thái không hợp lệ");
        }

        resv.setStatus(status);
        reservationRepository.save(resv);

        if (status.equals("Hoàn thành") || status.equals("Đã huỷ")) {
            RestaurantTable table = resv.getRestaurantTable();
            table.setStatus("Trống");
            tableRepository.save(table);
        }

        return ResponseEntity.ok("Cập nhật trạng thái thành công");
    }

    // ✅ Xoá đặt bàn
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Integer id) {
        Reservation resv = reservationRepository.findById(id).orElse(null);
        if (resv == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đặt bàn");
        }

        if (resv.getStatus().equals("Đã đặt")) {
            RestaurantTable table = resv.getRestaurantTable();
            table.setStatus("Trống");
            tableRepository.save(table);
        }

        reservationRepository.deleteById(id);
        return ResponseEntity.ok("Xoá đặt bàn thành công");
    }
    private boolean isTimeSlotOverlapping(Integer tableId, LocalDateTime start, Integer excludeReservationId) {
    LocalDateTime end = start.plusHours(1);
    return reservationRepository
        .findByRestaurantTable_TableIdAndReservationTimeBetween(tableId, start.minusHours(1), end)
        .stream()
        .anyMatch(r -> excludeReservationId == null || !r.getReservationId().equals(excludeReservationId));
}

}
