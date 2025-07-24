package com.restaurant.restaurant_backend.schedule;

import com.restaurant.restaurant_backend.model.Reservation;
import com.restaurant.restaurant_backend.model.RestaurantTable;
import com.restaurant.restaurant_backend.repository.ReservationRepository;
import com.restaurant.restaurant_backend.repository.RestaurantTableRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReservationScheduler {

    private final ReservationRepository reservationRepository;
    private final RestaurantTableRepository tableRepository;

    // ✅ Chạy mỗi phút để kiểm tra các đặt bàn đã hết hạn
    @Transactional
    @Scheduled(fixedRate = 60_000) // 60_000 ms = 60 giây
    public void resetExpiredReservations() {
        LocalDateTime now = LocalDateTime.now();

        List<Reservation> expiredReservations = reservationRepository.findAll().stream()
                .filter(reservation ->
                        reservation.getReservationTime().plusHours(1).isBefore(now) &&
                        reservation.getStatus().equals("Đã đặt"))
                .toList();

        for (Reservation reservation : expiredReservations) {
            // ✅ Cập nhật trạng thái reservation
            reservation.setStatus("Hoàn thành");
            reservationRepository.save(reservation);

            // ✅ Cập nhật trạng thái bàn thành "Trống"
            RestaurantTable table = reservation.getRestaurantTable();
            table.setStatus("Trống");
            tableRepository.save(table);

            log.info("Reset reservation [{}] và bàn [{}] đã hết hạn.",
                    reservation.getReservationId(), table.getTableId());
        }

        if (!expiredReservations.isEmpty()) {
            log.info("Đã reset {} bàn hết hạn", expiredReservations.size());
        }
    }
}
