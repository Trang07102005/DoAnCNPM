package com.restaurant.restaurant_backend.model;

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
@Table(name = "foodcategory") // Đảm bảo tên bảng khớp với DB
@Data // Nếu dùng Lombok
@NoArgsConstructor // Nếu dùng Lombok
@AllArgsConstructor // Nếu dùng Lombok
public class FoodCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID")
    private Integer categoryId;

    @Column(name = "CategoryName", nullable = false)
    private String categoryName;
}