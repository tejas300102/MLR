package com.mlr.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TransactionDto {
    private Long id;
    private Double amount;
    private String type; 
    private String description;
    private String categoryName;
    private String upiId; 
    private LocalDateTime createdAt;
}