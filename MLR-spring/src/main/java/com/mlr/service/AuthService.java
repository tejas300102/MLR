package com.mlr.service;

import com.mlr.dto.AuthResponseDto;
import com.mlr.dto.LoginDto;
import com.mlr.dto.RegisterDto;
import com.mlr.dto.UserProfileDto;

public interface AuthService {
    AuthResponseDto register(RegisterDto registerDto);
    AuthResponseDto login(LoginDto loginDto);
    UserProfileDto getProfile(String userId);
}