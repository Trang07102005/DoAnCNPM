package com.restaurant.restaurant_backend.controller;

import java.time.LocalDateTime;



import com.restaurant.restaurant_backend.dto.JwtResponse;
import com.restaurant.restaurant_backend.dto.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.restaurant_backend.dto.RegisterRequest;
import com.restaurant.restaurant_backend.model.Users;
import com.restaurant.restaurant_backend.repository.UserRepository;
import com.restaurant.restaurant_backend.security.JwtUtils;


import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired private JwtUtils jwtUtils;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Mật khẩu xác nhận không khớp");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email đã tồn tại");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Username đã tồn tại");
        }

        Users user = new Users(
            request.getUsername(),
            passwordEncoder.encode(request.getPassword()),
            request.getEmail(),
            "Customer" 
        );

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        return ResponseEntity.ok("Đăng ký thành công");
    }


@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    try {
        // Xác thực user
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(), request.getPassword()
            )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        Users user = userRepository.findByEmail(request.getEmail()).get();
        String jwtToken = jwtUtils.generateToken(userDetails);

        return ResponseEntity.ok(new JwtResponse(jwtToken, user.getUsername(), user.getEmail(), user.getRole()));
    } catch (BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai email hoặc mật khẩu");
    }
}


}
