package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.InvoiceStatus;
import com.restaurant.restaurant_backend.model.PaymentInvoice;
import com.restaurant.restaurant_backend.model.PaymentMethod;
import com.restaurant.restaurant_backend.repository.PaymentInvoiceRepository;
import com.restaurant.restaurant_backend.repository.PaymentMethodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentInvoiceService {

    private final PaymentInvoiceRepository paymentInvoiceRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    public List<PaymentInvoice> getAllInvoices() {
        return paymentInvoiceRepository.findAll();
    }

    public Optional<PaymentInvoice> getInvoiceById(Integer id) {
        return paymentInvoiceRepository.findById(id);
    }

    public PaymentInvoice createInvoice(PaymentInvoice invoice) {
        invoice.setStatus(InvoiceStatus.DRAFT);
        return paymentInvoiceRepository.save(invoice);
    }

    public PaymentInvoice updateInvoice(Integer id, PaymentInvoice updatedInvoice) {
        return paymentInvoiceRepository.findById(id).map(invoice -> {
            if (invoice.getStatus() == InvoiceStatus.FINALIZED) {
                throw new UnsupportedOperationException("Hóa đơn đã lưu không được phép chỉnh sửa!");
            }
            invoice.setPaidAmount(updatedInvoice.getPaidAmount());
            invoice.setNote(updatedInvoice.getNote());
            return paymentInvoiceRepository.save(invoice);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn!"));
    }

    public PaymentInvoice changePaymentMethod(Integer invoiceId, Integer newPaymentMethodId) {
        PaymentInvoice invoice = paymentInvoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn!"));

        if (invoice.getStatus() == InvoiceStatus.FINALIZED) {
            throw new UnsupportedOperationException("Hóa đơn đã lưu không được phép đổi phương thức thanh toán!");
        }

        PaymentMethod newPaymentMethod = paymentMethodRepository.findById(newPaymentMethodId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phương thức thanh toán mới!"));

        invoice.setPaymentMethod(newPaymentMethod);

        return paymentInvoiceRepository.save(invoice);
    }

    public PaymentInvoice finalizeInvoice(Integer id) {
        return paymentInvoiceRepository.findById(id).map(invoice -> {
            if (invoice.getStatus() == InvoiceStatus.FINALIZED) {
                throw new UnsupportedOperationException("Hóa đơn đã được lưu trước đó!");
            }
            invoice.setStatus(InvoiceStatus.FINALIZED);
            return paymentInvoiceRepository.save(invoice);
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn!"));
    }

    public void deleteInvoice(Integer id) {
        PaymentInvoice invoice = paymentInvoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn!"));
        if (invoice.getStatus() == InvoiceStatus.FINALIZED) {
            throw new UnsupportedOperationException("Hóa đơn đã lưu không được phép xóa!");
        }
        paymentInvoiceRepository.delete(invoice);
    }

}
