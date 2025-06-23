package com.restaurant.restaurant_backend.dto;

import com.restaurant.restaurant_backend.model.Ingredient;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class InventoryDTO {
    private Integer inventoryId;
    private Ingredient ingredient;
    private BigDecimal quantityInStock;
    private LocalDateTime lastUpdated;
    private String alert; // ⚠️ Sắp hết / Hết hàng
}
