package com.restaurant.restaurant_backend.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor 
@NoArgsConstructor 
public class JwtResponse {
    private String token;
    private String username;
    private String email;
    private String role;
    private Integer userId;
}
