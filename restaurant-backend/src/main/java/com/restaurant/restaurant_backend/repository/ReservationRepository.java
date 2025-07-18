package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

    List<Reservation> findByReservationTimeBetween(LocalDateTime startTime, LocalDateTime endTime);

    List<Reservation> findByStatus(String status);

    List<Reservation> findByRestaurantTable_TableId(Integer tableId);

    boolean existsByRestaurantTable_TableId(Integer tableId);

    // ✅ Kiểm tra trùng theo khoảng thời gian
    boolean existsByRestaurantTable_TableIdAndReservationTimeBetween(
            Integer tableId, LocalDateTime start, LocalDateTime end);
    List<Reservation> findByRestaurantTable_TableIdAndReservationTimeBetween(
    Integer tableId, LocalDateTime start, LocalDateTime end
);

}
