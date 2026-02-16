package com.mlr.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class RuleStatusResponseDto {
    private List<RuleStatus> rules;
    private String engineStatus;
    private LocalDateTime lastExecutionTime;
    private int totalRulesExecuted;
    private int alertsGenerated;
    private double averageExecutionTime;

    @Data
    public static class RuleStatus {
        private int id;
        private String name;
        private String description;
        private String status;
        private int triggerCount; 
        private LocalDateTime lastTriggered;
    }
}