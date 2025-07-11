package com.restaurant.restaurant_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ReservationID")
    private Integer reservationId;

    @Column(name = "CustomerName", nullable = false)
    private String customerName;

    @Column(name = "Phone")
    private String phone;

    @Column(name = "Email", nullable = false)
    private String email;

    @Column(name = "NumberOfPeople", nullable = false)
    private Integer numberOfPeople;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TableID")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private RestaurantTable restaurantTable;

    @Column(name = "ReservationTime", nullable = false)
    private LocalDateTime reservationTime;

    @Column(name = "Note")
    private String note;

    @Column(name = "Status")
    private String status;
}
