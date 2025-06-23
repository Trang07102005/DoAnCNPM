package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.PaymentInvoice;
import com.restaurant.restaurant_backend.service.PaymentInvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-invoices")
@RequiredArgsConstructor
public class PaymentInvoiceController {

    private final PaymentInvoiceService paymentInvoiceService;

    @GetMapping
    public List<PaymentInvoice> getAll() {
        return paymentInvoiceService.getAllInvoices();
    }

    @GetMapping("/{id}")
    public PaymentInvoice getById(@PathVariable Integer id) {
        return paymentInvoiceService.getInvoiceById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn!"));
    }

    @PostMapping
    public PaymentInvoice create(@RequestBody PaymentInvoice invoice) {
        return paymentInvoiceService.createInvoice(invoice);
    }

    @PutMapping("/{id}")
    public PaymentInvoice update(@PathVariable Integer id, @RequestBody PaymentInvoice updatedInvoice) {
        return paymentInvoiceService.updateInvoice(id, updatedInvoice);
    }

    @PutMapping("/{id}/change-payment-method")
    public PaymentInvoice changePaymentMethod(
            @PathVariable Integer id,
            @RequestParam Integer paymentMethodId) {
        return paymentInvoiceService.changePaymentMethod(id, paymentMethodId);
    }

    @PutMapping("/{id}/finalize")
    public PaymentInvoice finalizeInvoice(@PathVariable Integer id) {
        return paymentInvoiceService.finalizeInvoice(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        paymentInvoiceService.deleteInvoice(id);
    }
}
