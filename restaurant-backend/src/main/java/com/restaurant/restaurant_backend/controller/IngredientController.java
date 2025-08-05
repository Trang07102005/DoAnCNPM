package com.restaurant.restaurant_backend.controller;

import com.restaurant.restaurant_backend.model.Ingredient;
import com.restaurant.restaurant_backend.service.IngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/manager/ingredients")
@CrossOrigin(origins = "*") // Cho phép FE truy cập
public class IngredientController {

    @Autowired
    private IngredientService ingredientService;

    @GetMapping
    public List<Ingredient> getAllIngredients() {
        return ingredientService.getAllIngredients();
    }

    @GetMapping("/{id}")
    public Ingredient getIngredient(@PathVariable Integer id) {
        return ingredientService.getIngredientById(id);
    }

    @PostMapping
public ResponseEntity<?> addIngredient(@RequestBody Ingredient ingredient) {
    try {
        Ingredient saved = ingredientService.addIngredient(ingredient);
        return ResponseEntity.ok(saved);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Collections.singletonMap("error", "Vui lòng nhập đầy đủ thông tin, bao gồm số lượng trong kho"));
    }
}



    @PutMapping("/{id}")
    public Ingredient updateIngredient(@PathVariable Integer id, @RequestBody Ingredient ingredient) {
        return ingredientService.updateIngredient(id, ingredient);
    }

    @DeleteMapping("/{id}")
public ResponseEntity<?> deleteIngredient(@PathVariable Integer id) {
    try {
        ingredientService.deleteIngredient(id);
        return ResponseEntity.ok().build();
    } catch (RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(Collections.singletonMap("error", ex.getMessage()));
    }
}


}
