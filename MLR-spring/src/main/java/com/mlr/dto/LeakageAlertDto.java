package com.mlr.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class LeakageAlertDto {
    private Long id;
    private String ruleName;
    private String message;
    private String severity; 


    @JsonProperty("isRead")
    private boolean isRead;

    private LocalDateTime createdAt;
}