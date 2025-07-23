// src/main/java/com/restaurant/restaurant_backend/dto/PaymentRequestDTO.java

package com.restaurant.restaurant_backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class PaymentRequestDTO {
    private List<Integer> orderIds;
    private Integer methodId;
    private Integer cashierId;
    private String note;
}
