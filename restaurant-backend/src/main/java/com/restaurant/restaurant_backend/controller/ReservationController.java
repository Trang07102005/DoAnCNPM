package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.Reservation;
import com.restaurant.restaurant_backend.model.RestaurantTable;
import com.restaurant.restaurant_backend.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    // === API RESERVATION ===

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Integer id) {
        return reservationService.getReservationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/between")
    public ResponseEntity<List<Reservation>> findReservationsBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        return ResponseEntity.ok(reservationService.findReservationsBetween(startTime, endTime));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Reservation>> findByStatus(@PathVariable String status) {
        return ResponseEntity.ok(reservationService.findByStatus(status));
    }

    @GetMapping("/table/{tableId}")
    public ResponseEntity<List<Reservation>> findByTableId(@PathVariable Integer tableId) {
        return ResponseEntity.ok(reservationService.findByTableId(tableId));
    }

    @PostMapping
    public ResponseEntity<String> createReservation(@RequestBody Reservation reservation) {
        Reservation created = reservationService.createReservation(reservation);
        return ResponseEntity.ok("Đặt bàn thành công! Mã đặt bàn: " + created.getReservationId());
    }

    @PutMapping("/{id}/start-serving")
    public ResponseEntity<Reservation> startServing(@PathVariable Integer id) {
        return ResponseEntity.ok(reservationService.startServing(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Reservation> completeReservation(@PathVariable Integer id) {
        return ResponseEntity.ok(reservationService.completeReservation(id));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Reservation> cancelReservation(@PathVariable Integer id) {
        return ResponseEntity.ok(reservationService.cancelReservation(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable Integer id,
                                                         @RequestBody Reservation updatedReservation) {
        return ResponseEntity.ok(reservationService.updateReservation(id, updatedReservation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReservation(@PathVariable Integer id) {
        reservationService.deleteReservation(id);
        return ResponseEntity.ok("Xóa đặt bàn thành công!");
    }

    // === API BÀN TRỰC TIẾP (VÃNG LAI) ===

    @PutMapping("/tables/{tableId}/start-serving-direct")
    public ResponseEntity<RestaurantTable> startServingDirect(@PathVariable Integer tableId) {
        return ResponseEntity.ok(reservationService.startServingDirect(tableId));
    }

    @PutMapping("/tables/{tableId}/finish-serving-direct")
    public ResponseEntity<RestaurantTable> finishServingDirect(@PathVariable Integer tableId) {
        return ResponseEntity.ok(reservationService.finishServingDirect(tableId));
    }

}
