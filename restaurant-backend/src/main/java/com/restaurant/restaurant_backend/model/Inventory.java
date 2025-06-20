package com.restaurant.restaurant_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table; // <-- Quan trọng
import jakarta.persistence.FetchType; // Để dùng FetchType.LAZY

import java.math.BigDecimal;
import java.time.LocalDateTime;
// Import Lombok nếu bạn sử dụng
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "InventoryID")
    private Integer inventoryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IngredientID") // Cột khóa ngoại
    private Ingredient ingredient;

    @Column(name = "QuantityInStock", nullable = false)
    private BigDecimal quantityInStock;

    @Column(name = "LastUpdated")
    private LocalDateTime lastUpdated;
}