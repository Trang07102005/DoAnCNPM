package com.restaurant.restaurant_backend.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table; 

// Import Lombok nếu bạn sử dụng
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ingredient")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IngredientID")
    private Integer ingredientId;

    @Column(name = "IngredientName", nullable = false)
    private String ingredientName;

    @Column(name = "Unit", nullable = false)
    private String unit;

    @Column(name = "QuantityInStock", nullable = false)
    private BigDecimal quantityInStock;  // Thêm trường này

    @Column(name = "ImageUrl")
    private String imageUrl;  // ✅ Thêm dòng này
}
