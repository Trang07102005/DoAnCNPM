package com.restaurant.restaurant_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne; // Dùng OneToOne
import jakarta.persistence.Table;
import jakarta.persistence.FetchType;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "recipe")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RecipeID")
    private Integer recipeId;

    @OneToOne(fetch = FetchType.LAZY) // Mối quan hệ 1-1 với Food (mỗi công thức cho 1 món ăn)
    @JoinColumn(name = "FoodID")
    private Food food;

    @Column(name = "Description")
    private String description;
}