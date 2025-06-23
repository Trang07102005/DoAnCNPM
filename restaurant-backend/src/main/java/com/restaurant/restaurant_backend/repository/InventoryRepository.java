package com.restaurant.restaurant_backend.repository;

import com.restaurant.restaurant_backend.model.Inventory;
import com.restaurant.restaurant_backend.model.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Integer> {
    boolean existsByIngredient(Ingredient ingredient);
    Optional<Inventory> findByIngredient(Ingredient ingredient);
}
