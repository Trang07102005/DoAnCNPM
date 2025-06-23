package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.PaymentInvoice;
import com.restaurant.restaurant_backend.service.PaymentInvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-invoices")
@RequiredArgsConstructor
public class PaymentInvoiceController {

    private final PaymentInvoiceService paymentInvoiceService;

    @GetMapping
    public ResponseEntity<List<PaymentInvoice>> getAll() {
        return ResponseEntity.ok(paymentInvoiceService.getAllInvoices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentInvoice> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(paymentInvoiceService.getInvoiceById(id));
    }

    @PostMapping
    public ResponseEntity<PaymentInvoice> create(@RequestBody PaymentInvoice invoice) {
        PaymentInvoice created = paymentInvoiceService.createInvoice(invoice);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentInvoice> update(@PathVariable Integer id, @RequestBody PaymentInvoice updatedInvoice) {
        PaymentInvoice updated = paymentInvoiceService.updateInvoice(id, updatedInvoice);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/change-payment-method")
    public ResponseEntity<PaymentInvoice> changePaymentMethod(
            @PathVariable Integer id,
            @RequestParam Integer paymentMethodId) {
        PaymentInvoice updated = paymentInvoiceService.changePaymentMethod(id, paymentMethodId);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/finalize")
    public ResponseEntity<PaymentInvoice> finalizeInvoice(@PathVariable Integer id) {
        PaymentInvoice finalized = paymentInvoiceService.finalizeInvoice(id);
        return ResponseEntity.ok(finalized);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        paymentInvoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }
}
