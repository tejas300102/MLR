//package com.mlr.dto;
//
//import lombok.Data;
//import java.util.List;
//import java.util.Map;
//
//@Data
//public class LeakageAnalyticsDto {
//    private Double totalLeakage;
//    private int detectedCount;
//    private Map<String, Integer> byRule;
//    private List<LeakageAlertDto> recentAlerts;
//}

package com.mlr.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
public class LeakageAnalyticsDto {
    private Double totalLeakage;
    private Double averageMonthly;
    
    
    private List<MonthlyLeakageData> monthlyLeakage;
    private List<CategoryLeakageData> categoryLeakage;


    private int detectedCount;
    private Map<String, Integer> byRule;
    private List<LeakageAlertDto> recentAlerts;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonthlyLeakageData {
        private String month;
        private Double amount;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CategoryLeakageData {
        private String category;
        private Double amount;
    }
}