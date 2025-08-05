package com.restaurant.restaurant_backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.restaurant_backend.service.IngredientService;
import com.restaurant.restaurant_backend.model.Ingredient;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chef/ingredients")
@CrossOrigin(origins = "*") // Cho phép frontend truy cập
@RequiredArgsConstructor
public class ChefIngredientController {

    private final IngredientService ingredientService;

    // GET: /api/chef/ingredients
    @GetMapping
    public List<Ingredient> getAllIngredientsForChef() {
        return ingredientService.getAllIngredients();
    }

    
}