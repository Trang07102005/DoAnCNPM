package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.InvoiceStatus;
import com.restaurant.restaurant_backend.model.PaymentInvoice;
import com.restaurant.restaurant_backend.model.PaymentMethod;
import com.restaurant.restaurant_backend.repository.PaymentInvoiceRepository;
import com.restaurant.restaurant_backend.repository.PaymentMethodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentInvoiceService {

    private final PaymentInvoiceRepository paymentInvoiceRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    // Lấy tất cả hóa đơn
    public List<PaymentInvoice> getAllInvoices() {
        return paymentInvoiceRepository.findAll();
    }

    // Lấy theo ID
    public PaymentInvoice getInvoiceById(Integer id) {
        return paymentInvoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn!"));
    }

    // Tạo mới
    public PaymentInvoice createInvoice(PaymentInvoice invoice) {
        if (invoice.getPaidAmount() == null || invoice.getPaidAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Số tiền thanh toán phải lớn hơn hoặc bằng 0!");
        }

        invoice.setInvoiceID(null);
        invoice.setStatus(InvoiceStatus.DRAFT);

        if (invoice.getPaidAt() == null) {
            invoice.setPaidAt(LocalDateTime.now());
        }

        return paymentInvoiceRepository.save(invoice);
    }

    // Cập nhật: chỉ khi DRAFT
    public PaymentInvoice updateInvoice(Integer id, PaymentInvoice updated) {
        PaymentInvoice invoice = getInvoiceById(id);

        if (invoice.getStatus() == InvoiceStatus.FINALIZED) {
            throw new UnsupportedOperationException("Hóa đơn đã chốt, không được chỉnh sửa!");
        }

        if (updated.getPaidAmount() == null || updated.getPaidAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Số tiền thanh toán phải lớn hơn hoặc bằng 0!");
        }

        invoice.setPaidAmount(updated.getPaidAmount());
        invoice.setNote(updated.getNote());
        invoice.setPaidAt(updated.getPaidAt() != null ? updated.getPaidAt() : LocalDateTime.now());

        return paymentInvoiceRepository.save(invoice);
    }

    // Đổi phương thức thanh toán: chỉ khi DRAFT
    public PaymentInvoice changePaymentMethod(Integer invoiceId, Integer newPaymentMethodId) {
        PaymentInvoice invoice = getInvoiceById(invoiceId);

        if (invoice.getStatus() == InvoiceStatus.FINALIZED) {
            throw new UnsupportedOperationException("Hóa đơn đã chốt, không được đổi phương thức thanh toán!");
        }

        PaymentMethod newPaymentMethod = paymentMethodRepository.findById(newPaymentMethodId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phương thức thanh toán mới!"));

        invoice.setPaymentMethod(newPaymentMethod);

        return paymentInvoiceRepository.save(invoice);
    }

    // Chốt hóa đơn
    public PaymentInvoice finalizeInvoice(Integer id) {
        PaymentInvoice invoice = getInvoiceById(id);

        if (invoice.getStatus() == InvoiceStatus.FINALIZED) {
            throw new UnsupportedOperationException("Hóa đơn đã được chốt trước đó!");
        }

        invoice.setStatus(InvoiceStatus.FINALIZED);

        return paymentInvoiceRepository.save(invoice);
    }

    // Xoá: chỉ khi DRAFT
    public void deleteInvoice(Integer id) {
        PaymentInvoice invoice = getInvoiceById(id);

        if (invoice.getStatus() == InvoiceStatus.FINALIZED) {
            throw new UnsupportedOperationException("Hóa đơn đã chốt, không được xóa!");
        }

        paymentInvoiceRepository.delete(invoice);
    }
}
