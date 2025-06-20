package com.restaurant.restaurant_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.FetchType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "orderstatus")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderStatusID")
    private Integer orderStatusId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "OrderID")
    private Order order; // Liên kết với Entity Order

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "FoodID")
    private Food food;

    @Column(name = "Status")
    private String status; // 'Chưa chế biến', 'Đang chế biến', 'Hoàn thành'

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;
}