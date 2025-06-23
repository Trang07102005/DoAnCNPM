package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.Reservation;
import com.restaurant.restaurant_backend.model.RestaurantTable;
import com.restaurant.restaurant_backend.repository.ReservationRepository;
import com.restaurant.restaurant_backend.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RestaurantTableRepository restaurantTableRepository;

    // === CRUD RESERVATION ===

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Optional<Reservation> getReservationById(Integer id) {
        return reservationRepository.findById(id);
    }

    public List<Reservation> findReservationsBetween(LocalDateTime startTime, LocalDateTime endTime) {
        return reservationRepository.findByReservationTimeBetween(startTime, endTime);
    }

    public List<Reservation> findByStatus(String status) {
        return reservationRepository.findByStatus(status);
    }

    public List<Reservation> findByTableId(Integer tableId) {
        return reservationRepository.findByRestaurantTable_TableId(tableId);
    }

    public Reservation createReservation(Reservation reservation) {

        Integer tableId = reservation.getRestaurantTable().getTableId();
        LocalDateTime time = reservation.getReservationTime();

        boolean isOverlapping = reservationRepository.existsByRestaurantTable_TableIdAndReservationTime(tableId, time);
        if (isOverlapping) {
            throw new UnsupportedOperationException("Bàn đã có người đặt trong khung giờ này!");
        }

        RestaurantTable table = restaurantTableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn!"));

        if (!"Trống".equalsIgnoreCase(table.getStatus())) {
            throw new UnsupportedOperationException("Bàn hiện không trống, vui lòng chọn bàn khác!");
        }

        table.setStatus("Đã đặt");
        restaurantTableRepository.save(table);

        reservation.setRestaurantTable(table);
        reservation.setStatus("Đã đặt");
        return reservationRepository.save(reservation);
    }

    public Reservation startServing(Integer id) {
        return reservationRepository.findById(id).map(reservation -> {
            RestaurantTable table = reservation.getRestaurantTable();
            if (!"Đã đặt".equalsIgnoreCase(table.getStatus())) {
                throw new UnsupportedOperationException("Bàn không ở trạng thái 'Đã đặt'!");
            }
            table.setStatus("Đang phục vụ");
            restaurantTableRepository.save(table);
            return reservation;
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy đặt bàn!"));
    }

    public Reservation completeReservation(Integer id) {
        return reservationRepository.findById(id).map(reservation -> {
            RestaurantTable table = reservation.getRestaurantTable();
            if (!"Đang phục vụ".equalsIgnoreCase(table.getStatus())) {
                throw new UnsupportedOperationException("Chỉ được hoàn thành khi bàn đang phục vụ!");
            }
            reservation.setStatus("Hoàn thành");
            table.setStatus("Trống");
            restaurantTableRepository.save(table);
            return reservationRepository.save(reservation);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy đặt bàn!"));
    }

    public Reservation cancelReservation(Integer id) {
        return reservationRepository.findById(id).map(reservation -> {
            reservation.setStatus("Đã hủy");
            RestaurantTable table = reservation.getRestaurantTable();
            table.setStatus("Trống");
            restaurantTableRepository.save(table);
            return reservationRepository.save(reservation);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy đặt bàn!"));
    }

    public Reservation updateReservation(Integer id, Reservation updatedReservation) {
        return reservationRepository.findById(id).map(reservation -> {
            reservation.setCustomerName(updatedReservation.getCustomerName());
            reservation.setPhone(updatedReservation.getPhone());
            reservation.setEmail(updatedReservation.getEmail());
            reservation.setNumberOfPeople(updatedReservation.getNumberOfPeople());
            reservation.setReservationTime(updatedReservation.getReservationTime());
            reservation.setNote(updatedReservation.getNote());
            return reservationRepository.save(reservation);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy đặt bàn!"));
    }

    public void deleteReservation(Integer id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đặt bàn!"));
        if ("Hoàn thành".equalsIgnoreCase(reservation.getStatus())) {
            throw new UnsupportedOperationException("Không thể xóa đặt bàn đã hoàn thành!");
        }
        reservationRepository.delete(reservation);
    }

    // === BÀN VÃNG LAI ===

    public RestaurantTable startServingDirect(Integer tableId) {
        RestaurantTable table = restaurantTableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn!"));

        if (!"Trống".equalsIgnoreCase(table.getStatus())) {
            throw new UnsupportedOperationException("Bàn không trống, không thể phục vụ trực tiếp!");
        }

        table.setStatus("Đang phục vụ");
        return restaurantTableRepository.save(table);
    }

    public RestaurantTable finishServingDirect(Integer tableId) {
        RestaurantTable table = restaurantTableRepository.findById(tableId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bàn!"));

        if (!"Đang phục vụ".equalsIgnoreCase(table.getStatus())) {
            throw new UnsupportedOperationException("Bàn không đang phục vụ!");
        }

        table.setStatus("Trống");
        return restaurantTableRepository.save(table);
    }
}
