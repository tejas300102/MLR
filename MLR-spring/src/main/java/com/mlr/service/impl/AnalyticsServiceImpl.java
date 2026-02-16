package com.mlr.service.impl;

import com.mlr.dto.LeakageAlertDto;
import com.mlr.dto.LeakageAnalyticsDto;
import com.mlr.dto.SpendingAnalyticsDto;
import com.mlr.entity.LeakageAlert;
import com.mlr.entity.Transaction;
import com.mlr.repository.LeakageAlertRepository;
import com.mlr.repository.TransactionRepository;
import com.mlr.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired private TransactionRepository transactionRepository;
    @Autowired private LeakageAlertRepository alertRepository;

    @Override
    public SpendingAnalyticsDto getSpendingAnalytics(String userId) {
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        List<Transaction> debits = transactions.stream()
                .filter(t -> t.getType() == 1)
                .collect(Collectors.toList());

        double totalSpent = debits.stream().mapToDouble(Transaction::getAmount).sum();

        Map<String, Double> categoryMap = debits.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getCategory() != null ? t.getCategory().getName() : "Uncategorized",
                        Collectors.summingDouble(Transaction::getAmount)
                ));

        List<SpendingAnalyticsDto.CategorySplit> categoryList = categoryMap.entrySet().stream()
                .map(e -> {
                    SpendingAnalyticsDto.CategorySplit item = new SpendingAnalyticsDto.CategorySplit();
                    item.setCategory(e.getKey());
                    item.setAmount(e.getValue());
                    return item;
                })
                .collect(Collectors.toList());

        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        List<SpendingAnalyticsDto.DailySpend> dailySpends = debits.stream()
                .filter(t -> t.getCreatedAt() != null && t.getCreatedAt().isAfter(thirtyDaysAgo))
                .collect(Collectors.groupingBy(
                        t -> t.getCreatedAt().format(formatter),
                        Collectors.summingDouble(Transaction::getAmount)
                ))
                .entrySet().stream()
                .map(e -> {
                    SpendingAnalyticsDto.DailySpend ds = new SpendingAnalyticsDto.DailySpend();
                    ds.setDate(e.getKey());
                    ds.setAmount(e.getValue());
                    return ds;
                })
                // Sort chronologically
                .sorted(Comparator.comparing(SpendingAnalyticsDto.DailySpend::getDate))
                .collect(Collectors.toList());

        SpendingAnalyticsDto dto = new SpendingAnalyticsDto();
        dto.setTotalSpent(totalSpent);
        dto.setBudgetLimit(50000.0); 
        dto.setCategoryBreakdown(categoryList);
        dto.setDailySpending(dailySpends);
        
        return dto;
    }

    @Override
    public List<LeakageAlertDto> getLeakageAlerts(String userId) {
        return alertRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapAlertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean markAlertAsRead(String userId, Long alertId) {
        return alertRepository.findById(alertId)
                .filter(a -> a.getUserId().equals(userId))
                .map(a -> {
                    a.setRead(true);
                    alertRepository.save(a);
                    return true;
                }).orElse(false);
    }

    @Override
    public LeakageAnalyticsDto getLeakageAnalytics(String userId) {
        List<LeakageAlert> alerts = alertRepository.findByUserIdOrderByCreatedAtDesc(userId);

        double totalLeakage = alerts.stream()
                .mapToDouble(a -> a.getAmount() != null ? a.getAmount() : 0.0)
                .sum();

        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM");
        Map<String, Double> monthlyGroups = alerts.stream()
            .filter(a -> a.getCreatedAt() != null)
            .collect(Collectors.groupingBy(
                a -> a.getCreatedAt().format(monthFormatter),
                Collectors.summingDouble(a -> a.getAmount() != null ? a.getAmount() : 0.0)
            ));

        List<LeakageAnalyticsDto.MonthlyLeakageData> monthlyLeakage = monthlyGroups.entrySet().stream()
            .map(e -> new LeakageAnalyticsDto.MonthlyLeakageData(e.getKey(), e.getValue()))
            .collect(Collectors.toList());

        // Category Data
        Map<String, Double> categoryMap = alerts.stream()
            .collect(Collectors.groupingBy(
                a -> a.getRuleName() != null ? a.getRuleName() : "Unknown",
                Collectors.summingDouble(a -> a.getAmount() != null ? a.getAmount() : 0.0)
            ));

        List<LeakageAnalyticsDto.CategoryLeakageData> categoryLeakage = categoryMap.entrySet().stream()
            .map(e -> new LeakageAnalyticsDto.CategoryLeakageData(e.getKey(), e.getValue()))
            .sorted((a, b) -> b.getAmount().compareTo(a.getAmount()))
            .collect(Collectors.toList());

        LeakageAnalyticsDto dto = new LeakageAnalyticsDto();
        dto.setTotalLeakage(totalLeakage);
        dto.setMonthlyLeakage(monthlyLeakage);
        dto.setCategoryLeakage(categoryLeakage);
        dto.setAverageMonthly(monthlyGroups.size() > 0 ? totalLeakage / monthlyGroups.size() : 0);
        
        // Populate counts
        dto.setDetectedCount((int) alerts.stream().filter(a -> !a.isRead()).count());
        dto.setByRule(alerts.stream().collect(Collectors.groupingBy(LeakageAlert::getRuleName, Collectors.summingInt(x -> 1))));
        dto.setRecentAlerts(alerts.stream().limit(5).map(this::mapAlertToDto).collect(Collectors.toList()));

        return dto;
    }

    private LeakageAlertDto mapAlertToDto(LeakageAlert a) {
        LeakageAlertDto dto = new LeakageAlertDto();
        dto.setId(a.getId());
        dto.setRuleName(a.getRuleName());
        dto.setMessage(a.getMessage());
        dto.setSeverity(a.getSeverity() == 2 ? "High" : a.getSeverity() == 1 ? "Medium" : "Low");
        dto.setRead(a.isRead());
        dto.setCreatedAt(a.getCreatedAt());
        return dto;
    }
}