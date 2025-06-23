package com.restaurant.restaurant_backend.service;

import com.restaurant.restaurant_backend.model.Recipe;
import com.restaurant.restaurant_backend.model.RecipeDetail;
import com.restaurant.restaurant_backend.repository.RecipeDetailRepository;
import com.restaurant.restaurant_backend.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecipeDetailService {

    private final RecipeDetailRepository recipeDetailRepository;
    private final RecipeRepository recipeRepository; // ✅ Không còn lỗi static

    // 👉 Lấy tất cả chi tiết công thức
    public List<RecipeDetail> getAllRecipeDetails() {
        return recipeDetailRepository.findAll();
    }

    // 👉 Lấy chi tiết theo ID
    public Optional<RecipeDetail> getRecipeDetailById(Integer id) {
        return recipeDetailRepository.findById(id);
    }

    // 👉 Lấy tất cả chi tiết của 1 công thức
    public List<RecipeDetail> getRecipeDetailsByRecipeId(Integer recipeId) {
        return recipeDetailRepository.findByRecipe_RecipeId(recipeId);
    }

    // 👉 Tạo mới chi tiết công thức
    public RecipeDetail createRecipeDetail(RecipeDetail recipeDetail) {
        // 🔑 Validate Recipe tồn tại
        getValidRecipe(recipeDetail.getRecipe().getRecipeId());
        // 🔑 Validate Quantity > 0
        validateQuantity(recipeDetail.getQuantity());
        // 🔑 Lưu
        return recipeDetailRepository.save(recipeDetail);
    }

    // 👉 Cập nhật chi tiết công thức
    public RecipeDetail updateRecipeDetail(Integer id, RecipeDetail updatedDetail) {
        // 🔑 Validate Recipe tồn tại
        getValidRecipe(updatedDetail.getRecipe().getRecipeId());
        // 🔑 Validate Quantity > 0
        validateQuantity(updatedDetail.getQuantity());

        RecipeDetail existing = recipeDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết công thức!"));

        // Cập nhật thông tin
        existing.setIngredient(updatedDetail.getIngredient());
        existing.setQuantity(updatedDetail.getQuantity());

        return recipeDetailRepository.save(existing);
    }

    // 👉 Xoá chi tiết công thức
    public void deleteRecipeDetail(Integer id) {
        if (!recipeDetailRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy chi tiết công thức!");
        }
        recipeDetailRepository.deleteById(id);
    }

    // ✅ Validate Recipe tồn tại
    private Recipe getValidRecipe(Integer recipeId) {
        return recipeRepository.findById(recipeId) // 👉 KHÔNG static!
                .orElseThrow(() -> new RuntimeException("Không tìm thấy công thức với ID: " + recipeId));
    }

    // ✅ Validate Quantity > 0
    private void validateQuantity(BigDecimal quantity) {
        if (quantity == null || quantity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số lượng phải lớn hơn 0!");
        }
    }
}
