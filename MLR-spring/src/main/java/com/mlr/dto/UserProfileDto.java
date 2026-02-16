package com.mlr.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserProfileDto {
    private String firstName;
    private String lastName;
    private String email;
    private LocalDateTime createdAt;
}