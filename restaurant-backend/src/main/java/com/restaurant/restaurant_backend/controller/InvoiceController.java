package com.restaurant.restaurant_backend.controller;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import com.restaurant.restaurant_backend.dto.PaymentInvoiceDTO;
import com.restaurant.restaurant_backend.model.PaymentInvoice;
import com.restaurant.restaurant_backend.repository.PaymentInvoiceRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {

    @Autowired
    private PaymentInvoiceRepository invoiceRepository;

    @GetMapping
    public ResponseEntity<List<PaymentInvoiceDTO>> getAllInvoices() {
        List<PaymentInvoice> invoices = invoiceRepository.findAll();

        List<PaymentInvoiceDTO> invoiceDTOs = invoices.stream().map(invoice -> new PaymentInvoiceDTO(
                invoice.getInvoiceID(),
                invoice.getOrder().getOrderId(),
                invoice.getPaymentMethod().getMethodName(),
                invoice.getPaidAmount(),
                invoice.getPaidAt(),
                invoice.getCashier() != null ? invoice.getCashier().getUsername() : null,
                invoice.getNote(),
                invoice.getStatus()
        )).collect(Collectors.toList());

        return ResponseEntity.ok(invoiceDTOs);
    }

    @GetMapping("/filter")
public ResponseEntity<List<PaymentInvoiceDTO>> filterInvoices(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String date,
        @RequestParam(required = false) Long orderID) {

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    List<PaymentInvoice> invoices = invoiceRepository.findAll();

    List<PaymentInvoice> filtered = invoices.stream()
    .filter(i -> {
        System.out.println("Filtering status: param=" + status + ", invoiceStatus=" + i.getStatus());
        if (status == null || status.isEmpty()) return true;
        if (i.getStatus() == null) return false;
        return i.getStatus().name().equalsIgnoreCase(status);
    })
        .filter(i -> {
            if (date == null || date.isEmpty()) return true;
            if (i.getPaidAt() == null) return false;
            String paidAtStr = i.getPaidAt().format(formatter);
            return paidAtStr.equals(date);
        })
        .collect(Collectors.toList());

    List<PaymentInvoiceDTO> dtoList = filtered.stream()
        .map(invoice -> new PaymentInvoiceDTO(
            invoice.getInvoiceID(),
            invoice.getOrder().getOrderId(),
            invoice.getPaymentMethod().getMethodName(),
            invoice.getPaidAmount(),
            invoice.getPaidAt(),
            invoice.getCashier() != null ? invoice.getCashier().getUsername() : null,
            invoice.getNote(),
            invoice.getStatus()
        ))
        .collect(Collectors.toList());

    return ResponseEntity.ok(dtoList);
}

    

}
