package com.mlr.service.impl;

import com.mlr.dto.AuthResponseDto;
import com.mlr.dto.LoginDto;
import com.mlr.dto.RegisterDto;
import com.mlr.dto.UserProfileDto;
import com.mlr.entity.User;
import com.mlr.entity.Wallet;
import com.mlr.repository.UserRepository;
import com.mlr.repository.WalletRepository;
import com.mlr.security.JwtUtils;
import com.mlr.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private WalletRepository walletRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtils jwtUtils;

    @Override
    @Transactional
    public AuthResponseDto register(RegisterDto registerDto) {
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            return null; 
        }

        User user = new User();
        user.setEmail(registerDto.getEmail());
        user.setFirstName(registerDto.getFirstName());
        user.setLastName(registerDto.getLastName());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setRole("USER"); 

        User savedUser = userRepository.save(user);

        Wallet wallet = new Wallet(savedUser.getId(), 0.0);
        walletRepository.save(wallet);

        String token = jwtUtils.generateToken(savedUser.getEmail(), savedUser.getRole(), savedUser.getId());
        
        AuthResponseDto response = new AuthResponseDto();
        response.setToken(token);
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole());
        return response;
    }

    @Override
    public AuthResponseDto login(LoginDto loginDto) {
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!user.isActive()) {
            throw new RuntimeException("Your account has been blocked by the admin");
        }

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtils.generateToken(user.getEmail(), user.getRole(), user.getId());

        AuthResponseDto response = new AuthResponseDto();
        response.setToken(token);
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        return response;
    }

    @Override
    public UserProfileDto getProfile(String userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return null;

        UserProfileDto profile = new UserProfileDto();
        profile.setFirstName(user.getFirstName());
        profile.setLastName(user.getLastName());
        profile.setEmail(user.getEmail());
        profile.setCreatedAt(user.getCreatedAt());
        return profile;
    }
}