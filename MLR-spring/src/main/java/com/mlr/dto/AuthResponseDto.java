package com.mlr.dto;

import lombok.Data;

@Data
public class AuthResponseDto {
    private String token;
    private String email;
    private String role;
}