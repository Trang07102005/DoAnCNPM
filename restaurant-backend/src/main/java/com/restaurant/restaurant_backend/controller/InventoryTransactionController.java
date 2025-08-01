package com.restaurant.restaurant_backend.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.restaurant_backend.dto.InventoryTransactionDTO;
import com.restaurant.restaurant_backend.model.Ingredient;
import com.restaurant.restaurant_backend.model.InventoryTransaction;
import com.restaurant.restaurant_backend.repository.IngredientRepository;
import com.restaurant.restaurant_backend.repository.InventoryTransactionRepository;

@RestController 
@RequestMapping("/api/manager/inventory")
@PreAuthorize("hasRole('MANAGER')")
@CrossOrigin(origins = "*")
public class InventoryTransactionController {

    @Autowired
    private InventoryTransactionRepository repo;

    @Autowired
    private IngredientRepository ingredientRepo;

    @GetMapping
    public List<InventoryTransaction> getAll() {
        return repo.findAll();
    }

    @PostMapping
public ResponseEntity<?> createTransaction(@RequestBody InventoryTransactionDTO dto) {
    try {
        if (dto.getIngredientId() == null) {
            return ResponseEntity.badRequest().body("Thiếu ingredientId");
        }

        Ingredient ingredient = ingredientRepo.findById(dto.getIngredientId()).orElse(null);
        if (ingredient == null) {
            return ResponseEntity.badRequest().body("Không tìm thấy nguyên liệu với id = " + dto.getIngredientId());
        }

        // Tạo transaction
        InventoryTransaction transaction = new InventoryTransaction();
        transaction.setQuantity(dto.getQuantity());
        transaction.setTransactionType(dto.getTransactionType());
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setNote(dto.getNote());
        transaction.setIngredient(ingredient); // set ManyToOne

        // ✅ Cập nhật số lượng tồn kho
        BigDecimal currentQuantity = ingredient.getQuantityInStock();
        BigDecimal amount = dto.getQuantity();

        if (dto.getTransactionType().equalsIgnoreCase("NHAP")) {
            ingredient.setQuantityInStock(currentQuantity.add(amount));
        } else if (dto.getTransactionType().equalsIgnoreCase("XUAT")) {
            if (currentQuantity.compareTo(amount) < 0) {
                return ResponseEntity.badRequest().body("Không đủ số lượng trong kho để xuất.");
            }
            ingredient.setQuantityInStock(currentQuantity.subtract(amount));
        }

        ingredientRepo.save(ingredient); // lưu lại số lượng
        InventoryTransaction saved = repo.save(transaction);

        return ResponseEntity.ok(saved);
    } catch (Exception e) {
        e.printStackTrace(); // log lỗi
        return ResponseEntity.internalServerError().body("Lỗi máy chủ: " + e.getMessage());
    }
}


    

@GetMapping("/all")
public List<InventoryTransactionDTO> getAllTransactions() {
    List<InventoryTransaction> transactions = repo.findAll();

    return transactions.stream().map(transaction -> {
        InventoryTransactionDTO dto = new InventoryTransactionDTO();
        dto.setTransactionId(transaction.getTransactionId());
        dto.setQuantity(transaction.getQuantity());
        dto.setTransactionType(transaction.getTransactionType());
        dto.setTransactionDate(transaction.getTransactionDate());
        dto.setNote(transaction.getNote());

        // 👇 Lấy tên nguyên liệu nếu có
        if (transaction.getIngredient() != null) {
            dto.setIngredientName(transaction.getIngredient().getIngredientName());
        }

        return dto;
    }).collect(Collectors.toList());
}



}
