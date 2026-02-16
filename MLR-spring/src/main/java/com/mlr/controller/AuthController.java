package com.mlr.controller;

import com.mlr.dto.AuthResponseDto;
import com.mlr.dto.LoginDto;
import com.mlr.dto.RegisterDto;
import com.mlr.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDto registerDto) {
        
        AuthResponseDto result = authService.register(registerDto);
        if (result == null) {
            return ResponseEntity.badRequest().body("Registration failed");
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDto loginDto) {
        try {
            AuthResponseDto result = authService.login(loginDto);
            return ResponseEntity.ok(result);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
        }
    }

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String userId = authentication.getName();
        Object profile = authService.getProfile(userId);
        return ResponseEntity.ok(profile);
    }
}