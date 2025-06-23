package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.Ingredient;
import com.restaurant.restaurant_backend.model.Inventory;
import com.restaurant.restaurant_backend.model.InventoryTransaction;
import com.restaurant.restaurant_backend.repository.IngredientRepository;
import com.restaurant.restaurant_backend.repository.InventoryRepository;
import com.restaurant.restaurant_backend.repository.InventoryTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryTransactionService {

    private final InventoryTransactionRepository transactionRepo;
    private final InventoryRepository inventoryRepo;
    private final IngredientRepository ingredientRepo;

    // ✅ Lấy tất cả giao dịch
    public List<InventoryTransaction> getAllTransactions() {
        return transactionRepo.findAll();
    }

    // ✅ Lọc theo thời gian
    public List<InventoryTransaction> getTransactionsByDateRange(LocalDateTime from, LocalDateTime to) {
        return transactionRepo.findByTransactionDateBetween(from, to);
    }

    // ✅ Lọc theo loại
    public List<InventoryTransaction> getTransactionsByType(String type) {
        return transactionRepo.findByTransactionType(type);
    }

    // ✅ Tạo giao dịch nhập / xuất
    public InventoryTransaction createTransaction(InventoryTransaction transaction) {
        Ingredient ingredient = ingredientRepo.findById(transaction.getIngredient().getIngredientId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nguyên liệu!"));

        Inventory inventory = inventoryRepo.findByIngredient(ingredient)
                .orElseThrow(() -> new RuntimeException("Nguyên liệu này chưa có tồn kho!"));

        BigDecimal quantity = transaction.getQuantity();
        if (quantity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Số lượng phải lớn hơn 0!");
        }

        String type = transaction.getTransactionType();
        if (!type.equalsIgnoreCase("Nhập kho") && !type.equalsIgnoreCase("Xuất kho")) {
            throw new RuntimeException("Loại giao dịch không hợp lệ (phải là 'Nhập kho' hoặc 'Xuất kho')!");
        }

        if (type.equalsIgnoreCase("Nhập kho")) {
            inventory.setQuantityInStock(inventory.getQuantityInStock().add(quantity));
        } else if (type.equalsIgnoreCase("Xuất kho")) {
            if (inventory.getQuantityInStock().compareTo(quantity) < 0) {
                throw new RuntimeException("Không đủ hàng để xuất kho!");
            }
            inventory.setQuantityInStock(inventory.getQuantityInStock().subtract(quantity));
        }

        inventory.setLastUpdated(LocalDateTime.now());
        inventoryRepo.save(inventory);

        transaction.setIngredient(ingredient);
        transaction.setTransactionDate(LocalDateTime.now());

        return transactionRepo.save(transaction);
    }
}
