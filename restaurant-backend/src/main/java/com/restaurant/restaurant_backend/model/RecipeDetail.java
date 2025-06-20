package com.restaurant.restaurant_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne; // Để dùng ManyToOne
import jakarta.persistence.Table;
import jakarta.persistence.FetchType; // Để dùng FetchType.LAZY

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "recipe_detail")
@Data // Lombok
@NoArgsConstructor // Lombok
@AllArgsConstructor // Lombok
public class RecipeDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RecipeDetailID")
    private Integer recipeDetailId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RecipeID")
    private Recipe recipe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IngredientID")
    private Ingredient ingredient;

    @Column(name = "Quantity", nullable = false)
    private BigDecimal quantity;

 
}