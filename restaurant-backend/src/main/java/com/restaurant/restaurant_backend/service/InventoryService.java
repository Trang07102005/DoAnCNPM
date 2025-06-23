package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.dto.InventoryDTO;
import com.restaurant.restaurant_backend.model.Inventory;
import com.restaurant.restaurant_backend.model.Ingredient;
import com.restaurant.restaurant_backend.repository.InventoryRepository;
import com.restaurant.restaurant_backend.repository.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final IngredientRepository ingredientRepository;

    // Ngưỡng cảnh báo mới: 5
    private static final BigDecimal ALERT_THRESHOLD = new BigDecimal("5");

    //  Lấy tất cả tồn kho kèm cảnh báo sắp hết / hết hàng
    public List<InventoryDTO> getAllInventoryWithAlert() {
        List<Inventory> list = inventoryRepository.findAll();
        List<InventoryDTO> result = new ArrayList<>();

        for (Inventory inv : list) {
            String alert = "";
            if (inv.getQuantityInStock().compareTo(BigDecimal.ZERO) == 0) {
                alert = "⚠️ HẾT HÀNG!";
            } else if (inv.getQuantityInStock().compareTo(ALERT_THRESHOLD) < 0) {
                alert = "⚠️ SẮP HẾT (Dưới " + ALERT_THRESHOLD + ")";
            }

            result.add(new InventoryDTO(
                    inv.getInventoryId(),
                    inv.getIngredient(),
                    inv.getQuantityInStock(),
                    inv.getLastUpdated(),
                    alert
            ));
        }
        return result;
    }

    // Các method khác giữ nguyên
    public Inventory getInventoryById(Integer id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tồn kho với ID: " + id));
    }

    public Inventory createInventory(Inventory inventory) {
        Ingredient ingredient = ingredientRepository.findById(inventory.getIngredient().getIngredientId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nguyên liệu!"));

        if (inventoryRepository.existsByIngredient(ingredient)) {
            throw new RuntimeException("Nguyên liệu này đã có trong tồn kho!");
        }

        if (inventory.getQuantityInStock() == null || inventory.getQuantityInStock().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Số lượng tồn kho phải >= 0!");
        }

        inventory.setIngredient(ingredient);
        inventory.setLastUpdated(LocalDateTime.now());
        return inventoryRepository.save(inventory);
    }

    public Inventory updateInventory(Integer id, Inventory updated) {
        Inventory existing = getInventoryById(id);

        if (updated.getQuantityInStock() == null || updated.getQuantityInStock().compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Số lượng tồn kho phải >= 0!");
        }

        existing.setQuantityInStock(updated.getQuantityInStock());
        existing.setLastUpdated(LocalDateTime.now());

        return inventoryRepository.save(existing);
    }

    public void deleteInventory(Integer id) {
        if (!inventoryRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy tồn kho để xoá!");
        }
        inventoryRepository.deleteById(id);
    }
}
