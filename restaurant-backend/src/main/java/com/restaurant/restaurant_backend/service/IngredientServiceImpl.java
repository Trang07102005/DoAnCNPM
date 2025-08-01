package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.Ingredient;
import com.restaurant.restaurant_backend.repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class IngredientServiceImpl implements IngredientService {

    @Autowired
    private IngredientRepository ingredientRepository;

    @Override
    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    @Override
    public Ingredient getIngredientById(Integer id) {
        return ingredientRepository.findById(id).orElse(null);
    }

    @Override
    public Ingredient addIngredient(Ingredient ingredient) {
        return ingredientRepository.save(ingredient);
    }

    @Override
    public Ingredient updateIngredient(Integer id, Ingredient ingredient) {
        Ingredient existing = ingredientRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setIngredientName(ingredient.getIngredientName());
            existing.setUnit(ingredient.getUnit());
            existing.setImageUrl(ingredient.getImageUrl());
            return ingredientRepository.save(existing);
        }
        return null;
    }

    @Override
public void deleteIngredient(Integer id) {
    if (!ingredientRepository.existsById(id)) {
        throw new RuntimeException("Nguyên liệu không tồn tại với id = " + id);
    }
    try {
        ingredientRepository.deleteById(id);
    } catch (DataIntegrityViolationException e) {
        throw new RuntimeException("Không thể xóa nguyên liệu do ràng buộc dữ liệu: " + e.getMessage());
    }
}

@Override
public void reduceIngredientStock(Integer ingredientId, BigDecimal quantityUsed) {
    Ingredient ingredient = ingredientRepository.findById(ingredientId)
            .orElseThrow(() -> new RuntimeException("Nguyên liệu không tồn tại với id = " + ingredientId));
    
    BigDecimal currentQty = ingredient.getQuantityInStock();
    if (currentQty.compareTo(quantityUsed) < 0) {
        throw new RuntimeException("Nguyên liệu " + ingredient.getIngredientName() + " không đủ trong kho");
    }

    ingredient.setQuantityInStock(currentQty.subtract(quantityUsed));
    ingredientRepository.save(ingredient);
}

}
