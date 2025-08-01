package com.restaurant.restaurant_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class InventoryTransactionDTO {
    private Integer transactionId;
    private BigDecimal quantity;
    private String transactionType;
    private LocalDateTime transactionDate;
    private String note;
    private Integer ingredientId;      
    private String ingredientName; // lấy từ Ingredient
}
