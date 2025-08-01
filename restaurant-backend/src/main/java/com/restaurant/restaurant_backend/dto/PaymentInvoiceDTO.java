package com.restaurant.restaurant_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.restaurant.restaurant_backend.model.PaymentInvoice.InvoiceStatus;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentInvoiceDTO {
    private Integer invoiceID;
    private Integer orderId;
    private String paymentMethodName;
    private BigDecimal paidAmount;
    private LocalDateTime paidAt;
    private String cashierUsername;
    private String note;
    private InvoiceStatus status;
}
