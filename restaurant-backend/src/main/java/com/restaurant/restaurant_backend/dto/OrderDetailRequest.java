package com.restaurant.restaurant_backend.dto;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderDetailRequest {
    private Integer foodId;
    private Integer quantity;
    private BigDecimal price;
     private Integer orderId;
}