package com.restaurant.restaurant_backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "orderstatus")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderStatusID")
    private Integer orderStatusId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "OrderID")
    @JsonBackReference // Ngăn vòng lặp khi serialize JSON
    private Order order;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "FoodID")
    private Food food;

    @Column(name = "Status")
    private String status; // 'Chưa chế biến', 'Đang chế biến', 'Hoàn thành'

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    @Override
    public String toString() {
        return "OrderStatus{" +
                "orderStatusId=" + orderStatusId +
                ", food=" + (food != null ? food.getFoodName() : null) +
                ", status='" + status + '\'' +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
