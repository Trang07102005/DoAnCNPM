package com.restaurant.restaurant_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "food")
@Data
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "foodid")
    private Integer foodId;

    @Column(name = "food_name", nullable = false)
    private String foodName;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "status")
    private String status; // "Đang bán", "Tạm ngưng", "Ngưng bán"

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoryid", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private FoodCategory category;

    // Constructors
    public Food() {}

    public Food(String foodName, BigDecimal price, String imageUrl, String status, FoodCategory category) {
        this.foodName = foodName;
        this.price = price;
        this.imageUrl = imageUrl;
        this.status = status;
        this.category = category;
    }
}
