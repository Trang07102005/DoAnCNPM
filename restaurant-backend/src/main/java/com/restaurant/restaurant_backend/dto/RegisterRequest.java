package com.restaurant.restaurant_backend.dto;
import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String username;
    private String password;
    private String confirmPassword;
}
