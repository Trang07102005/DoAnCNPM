package com.restaurant.restaurant_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor 
public class PendingDishDTO {
    private Integer orderStatusId;
    private String foodName;
    private Integer orderId;
    private String status;
    private LocalDateTime updatedAt;
    private String imageUrl;
    private String tableName;
    private Integer foodId;
}
