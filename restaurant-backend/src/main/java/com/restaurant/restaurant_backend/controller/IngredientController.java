package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.Ingredient;
import com.restaurant.restaurant_backend.service.IngredientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
@RequiredArgsConstructor
public class IngredientController {

    private final IngredientService ingredientService;

    // GET all
    @GetMapping
    public ResponseEntity<List<Ingredient>> getAllIngredients() {
        return ResponseEntity.ok(ingredientService.getAllIngredients());
    }

    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getIngredientById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(ingredientService.getIngredientById(id));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body("Lỗi: " + ex.getMessage());
        }
    }

    // POST create
    @PostMapping
    public ResponseEntity<?> createIngredient(@RequestBody Ingredient ingredient) {
        try {
            Ingredient created = ingredientService.createIngredient(ingredient);
            return ResponseEntity.status(201).body(created);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body("Lỗi: " + ex.getMessage());
        }
    }

    // PUT update
    @PutMapping("/{id}")
    public ResponseEntity<?> updateIngredient(@PathVariable Integer id, @RequestBody Ingredient ingredient) {
        try {
            Ingredient updated = ingredientService.updateIngredient(id, ingredient);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body("Lỗi: " + ex.getMessage());
        }
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIngredient(@PathVariable Integer id) {
        try {
            ingredientService.deleteIngredient(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body("Lỗi: " + ex.getMessage());
        }
    }
}
