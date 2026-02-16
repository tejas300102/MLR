package com.mlr.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "rule_execution_logs")
@Getter @Setter @NoArgsConstructor
public class RuleExecutionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime executedAt = LocalDateTime.now();

    private String ruleName;

    private int usersProcessed;

    private int alertsGenerated;

    private Long executionTimeMs; 
}