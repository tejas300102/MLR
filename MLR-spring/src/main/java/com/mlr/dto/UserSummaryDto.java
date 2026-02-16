package com.mlr.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserSummaryDto {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private boolean isBlocked; 
    private LocalDateTime createdAt;
}