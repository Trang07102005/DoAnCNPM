package com.restaurant.restaurant_backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderDetailDTO {
    private Integer orderDetailId;
    private Integer foodId;
    private String foodName;
    private BigDecimal price;
    private Integer quantity;
    private Integer orderId;   
    private String imageUrl;
}
