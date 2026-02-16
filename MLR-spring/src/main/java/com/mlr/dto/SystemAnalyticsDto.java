package com.mlr.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SystemAnalyticsDto {
    private long totalUsers;
    private int totalTransactions;
    private int unresolvedAlerts;
    private double totalLeakageDetected;
    private double averageTransactionAmount;
    private String systemHealth; 
    
    private List<MonthlyTransactionData> monthlyTransactions;
    private List<CategoryTrend> categoryTrends;
    
    private List<RecentAlertSummary> recentAlerts;
    private int alertsByUser;

    @Data
    public static class MonthlyTransactionData {
        private String month;
        private double amount;
        private int count;
    }

    @Data
    public static class CategoryTrend {
        private String category;
        private double amount;
    }

    @Data
    public static class RecentAlertSummary {
        private Long id;
        private String ruleName;
        private String message;
        private String severity;
        private String userEmail;
        private LocalDateTime createdAt;
    }
}