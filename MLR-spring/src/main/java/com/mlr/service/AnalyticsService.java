package com.mlr.service;

import com.mlr.dto.LeakageAlertDto;
import com.mlr.dto.LeakageAnalyticsDto;
import com.mlr.dto.SpendingAnalyticsDto;

import java.util.List;

public interface AnalyticsService {
    SpendingAnalyticsDto getSpendingAnalytics(String userId);
    List<LeakageAlertDto> getLeakageAlerts(String userId);
    boolean markAlertAsRead(String userId, Long alertId);
    LeakageAnalyticsDto getLeakageAnalytics(String userId);
}