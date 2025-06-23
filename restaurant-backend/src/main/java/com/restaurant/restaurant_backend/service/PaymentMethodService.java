package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.PaymentMethod;
import com.restaurant.restaurant_backend.repository.PaymentInvoiceRepository;
import com.restaurant.restaurant_backend.repository.PaymentMethodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;
    private final PaymentInvoiceRepository paymentInvoiceRepository;

    public List<PaymentMethod> getAllPaymentMethods() {
        return paymentMethodRepository.findAll();
    }

    public Optional<PaymentMethod> getPaymentMethodById(Integer id) {
        return paymentMethodRepository.findById(id);
    }

    public PaymentMethod createPaymentMethod(PaymentMethod paymentMethod) {
        if (paymentMethodRepository.existsByMethodName(paymentMethod.getMethodName())) {
            throw new IllegalArgumentException("Tên phương thức thanh toán đã tồn tại!");
        }
        return paymentMethodRepository.save(paymentMethod);
    }

    public PaymentMethod updatePaymentMethod(Integer id, PaymentMethod updatedPaymentMethod) {
        PaymentMethod existing = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phương thức thanh toán!"));

        if (!existing.getMethodName().equals(updatedPaymentMethod.getMethodName()) &&
                paymentMethodRepository.existsByMethodName(updatedPaymentMethod.getMethodName())) {
            throw new IllegalArgumentException("Tên phương thức thanh toán đã tồn tại!");
        }

        existing.setMethodName(updatedPaymentMethod.getMethodName());
        existing.setNote(updatedPaymentMethod.getNote());

        return paymentMethodRepository.save(existing);
    }

    public void deletePaymentMethod(Integer id) {
        PaymentMethod paymentMethod = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phương thức thanh toán!"));

        // Kiểm tra nếu đã gán hóa đơn thì không cho xóa
        boolean isUsed = paymentInvoiceRepository.existsByPaymentMethod(paymentMethod);
        if (isUsed) {
            throw new UnsupportedOperationException("Phương thức thanh toán này đang được sử dụng, không thể xóa!");
        }

        paymentMethodRepository.delete(paymentMethod);
    }
}
