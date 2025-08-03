package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.Reservation;
import com.restaurant.restaurant_backend.repository.ReservationRepository;
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

    // ✅ Lấy tất cả đặt bàn
    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    // ✅ Tạo đặt bàn mới (không set trạng thái bàn)
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
        LocalDateTime reservationTime = reservation.getReservationTime();
        LocalDateTime checkStart = reservationTime.minusHours(1).minusMinutes(30);
        LocalDateTime checkEnd = reservationTime.plusHours(1).plusMinutes(30);

        boolean exists = reservationRepository
                .findByRestaurantTable_TableIdAndReservationTimeBetween(tableId, checkStart, checkEnd)
                .stream().findAny().isPresent();

        if (exists) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Bàn đã được đặt trong khoảng thời gian này hoặc quá gần thời gian khác.");
        }

        reservation.setStatus("Đã đặt");
        Reservation savedRes = reservationRepository.save(reservation);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedRes);
    }

    // ✅ Cập nhật đặt bàn
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
        LocalDateTime newReservationTime = updatedReservation.getReservationTime();
        LocalDateTime checkStart = newReservationTime.minusHours(1).minusMinutes(30);
        LocalDateTime checkEnd = newReservationTime.plusHours(1).plusMinutes(30);

        boolean exists = reservationRepository
                .findByRestaurantTable_TableIdAndReservationTimeBetween(newTableId, checkStart, checkEnd)
                .stream()
                .anyMatch(r -> !r.getReservationId().equals(id));

        if (exists) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Bàn đã được đặt trong khoảng thời gian này hoặc quá gần thời gian khác.");
        }

        existing.setCustomerName(updatedReservation.getCustomerName().trim());
        existing.setPhone(updatedReservation.getPhone());
        existing.setEmail(updatedReservation.getEmail().trim());
        existing.setNumberOfPeople(updatedReservation.getNumberOfPeople());
        existing.setNote(updatedReservation.getNote());
        existing.setReservationTime(updatedReservation.getReservationTime());
        existing.setRestaurantTable(updatedReservation.getRestaurantTable());

        reservationRepository.save(existing);
        return ResponseEntity.ok("Cập nhật đặt bàn thành công");
    }

    // ✅ Cập nhật trạng thái đặt bàn (giữ nguyên table, không thay đổi table status)
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
        return ResponseEntity.ok("Cập nhật trạng thái thành công");
    }

    // ✅ Xoá đặt bàn
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Integer id) {
        Reservation resv = reservationRepository.findById(id).orElse(null);
        if (resv == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy đặt bàn");
        }

        reservationRepository.deleteById(id);
        return ResponseEntity.ok("Xoá đặt bàn thành công");
    }

    // ✅ Dùng cho cập nhật trạng thái bàn (nếu sau này muốn dùng)
    private boolean isTimeSlotOverlapping(Integer tableId, LocalDateTime start, Integer excludeReservationId) {
        LocalDateTime end = start.plusHours(1);
        return reservationRepository
            .findByRestaurantTable_TableIdAndReservationTimeBetween(tableId, start.minusHours(1), end)
            .stream()
            .anyMatch(r -> excludeReservationId == null || !r.getReservationId().equals(excludeReservationId));
    }
}
