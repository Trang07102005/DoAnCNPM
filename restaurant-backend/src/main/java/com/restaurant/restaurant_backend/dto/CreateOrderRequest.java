package com.restaurant.restaurant_backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateOrderRequest {
    private Integer tableId;
    private Integer createdById;
    private String customerName;
    private String note;
    private Integer numberOfGuests;
    private BigDecimal total;
    private List<OrderDetailRequest> orderDetails;
}
