package com.restaurant.restaurant_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table; // <-- Đảm bảo dòng import này đúng và không có dòng Table nào khác
import jakarta.persistence.FetchType;
import lombok.Data;              // Nếu dùng Lombok


import java.math.BigDecimal; // Dùng BigDecimal cho tiền tệ

@Entity
@Table(name = "food")
@Data
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FoodID")
    private Integer foodId;

    @Column(name = "FoodName", nullable = false)
    private String foodName;

    @Column(name = "Price", nullable = false)
    private BigDecimal price; // Sử dụng BigDecimal cho giá tiền

    @Column(name = "ImageUrl")
    private String imageUrl;

    @Column(name = "Status")
    private String status; // "Đang bán", "Tạm ngưng", "Ngưng bán"

    // Mối quan hệ Many-to-One với FoodCategory (Nhiều món ăn thuộc về Một danh mục)
    @ManyToOne(fetch = FetchType.LAZY) // LAZY tải category khi cần, EAGER tải ngay
    @JoinColumn(name = "CategoryID", nullable = false) // Tên cột Foreign Key trong bảng Food
    private FoodCategory category; // Đối tượng FoodCategory mà món ăn này thuộc về

    // Constructors
    public Food() {}

    public Food(String foodName, BigDecimal price, String imageUrl, String status, FoodCategory category) {
        this.foodName = foodName;
        this.price = price;
        this.imageUrl = imageUrl;
        this.status = status;
        this.category = category;
    }

    // Getters and Setters
    public Integer getFoodId() { return foodId; }
    public void setFoodId(Integer foodId) { this.foodId = foodId; }
    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public FoodCategory getCategory() { return category; }
    public void setCategory(FoodCategory category) { this.category = category; }
    
}