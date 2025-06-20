package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.PaymentInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentInvoiceRepository extends JpaRepository<PaymentInvoice, Integer> {
}

