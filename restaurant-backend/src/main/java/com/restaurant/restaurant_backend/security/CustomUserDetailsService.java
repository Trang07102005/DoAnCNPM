package com.restaurant.restaurant_backend.security;

import com.restaurant.restaurant_backend.model.Users;
import com.restaurant.restaurant_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    System.out.println("✅ loadUserByUsername: " + email); // Thêm dòng log

    Users user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Email không tồn tại"));

    return new org.springframework.security.core.userdetails.User(
            user.getEmail(),
            user.getPassword(),
            Collections.singleton(() -> "ROLE_" + user.getRole().toUpperCase())
            
    );
}
}

