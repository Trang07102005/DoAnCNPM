package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.Ingredient;
import com.restaurant.restaurant_backend.repository.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IngredientService {

    private final IngredientRepository ingredientRepository;

    // Lấy tất cả nguyên liệu
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    // Lấy nguyên liệu theo ID
    public Ingredient getIngredientById(Integer id) {
        return ingredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nguyên liệu với ID: " + id));
    }

    // Tạo mới: không trùng tên
    public Ingredient createIngredient(Ingredient ingredient) {
        if (ingredientRepository.existsByIngredientNameIgnoreCase(ingredient.getIngredientName())) {
            throw new RuntimeException("Tên nguyên liệu đã tồn tại!");
        }
        ingredient.setIngredientId(null);
        return ingredientRepository.save(ingredient);
    }

    // Cập nhật: không trùng tên khác (trừ chính nó)
    public Ingredient updateIngredient(Integer id, Ingredient updated) {
        Ingredient existing = getIngredientById(id);

        // Nếu tên mới khác tên cũ, thì phải kiểm tra trùng
        if (!existing.getIngredientName().equalsIgnoreCase(updated.getIngredientName())) {
            if (ingredientRepository.existsByIngredientNameIgnoreCase(updated.getIngredientName())) {
                throw new RuntimeException("Tên nguyên liệu đã tồn tại!");
            }
        }

        existing.setIngredientName(updated.getIngredientName());
        existing.setUnit(updated.getUnit());

        return ingredientRepository.save(existing);
    }

    // Xoá
    public void deleteIngredient(Integer id) {
        if (!ingredientRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy nguyên liệu để xoá!");
        }
        ingredientRepository.deleteById(id);
    }
}
