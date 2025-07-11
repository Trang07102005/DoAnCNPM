package com.restaurant.restaurant_backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class FoodRequest {
    private String foodName;
    private BigDecimal price;
    private String imageUrl;
    private String status;
    private Integer categoryId;

    // Nếu không dùng Lombok, bạn có thể thay bằng getter/setter đầy đủ:
    
    public String getFoodName() { return foodName; }
    public void setFoodName(String foodName) { this.foodName = foodName; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }
    
}
