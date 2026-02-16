package com.mlr.dto;

import lombok.Data;
import java.util.List;

@Data
public class SpendingAnalyticsDto {
    private Double totalSpent;
    private Double budgetLimit; 
    
    private List<CategorySplit> categoryBreakdown; 
    
    private List<DailySpend> dailySpending;

    @Data
    public static class DailySpend {
        private String date; 
        private Double amount;
    }

    @Data
    public static class CategorySplit {
        private String category;
        private Double amount;
    }
}