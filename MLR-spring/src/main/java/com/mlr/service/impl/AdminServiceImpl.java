package com.mlr.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mlr.dto.RuleStatusResponseDto;
import com.mlr.dto.RuleWorkflow;
import com.mlr.dto.SystemAnalyticsDto;
import com.mlr.dto.UserSummaryDto;
import com.mlr.entity.*;
import com.mlr.repository.*;
import com.mlr.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired private UserRepository userRepository;
    @Autowired private WalletRepository walletRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private LeakageAlertRepository alertRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private RuleExecutionLogRepository ruleLogRepository;

    @Override
    public List<UserSummaryDto> getAllUsers(String search) {
        List<User> users = userRepository.findAll();
        return users.stream()
                .filter(u -> {
                    if (u.getRole() != null) {
                        String role = u.getRole().trim();
                        if ("ADMIN".equalsIgnoreCase(role) || "ROLE_ADMIN".equalsIgnoreCase(role)) return false;
                    }
                    if (u.getEmail() != null) {
                        if ("admin@mlr.com".equalsIgnoreCase(u.getEmail().trim())) return false;
                    }
                    return true;
                })
                .filter(u -> {
                    if (search == null || search.isEmpty()) return true;
                    String lowerSearch = search.toLowerCase().trim();
                    String email = u.getEmail() != null ? u.getEmail().toLowerCase() : "";
                    String firstName = u.getFirstName() != null ? u.getFirstName().toLowerCase() : "";
                    
                    return email.contains(lowerSearch) || firstName.contains(lowerSearch);
                })
                .map(u -> {
                    UserSummaryDto dto = new UserSummaryDto();
                    dto.setId(u.getId());
                    dto.setEmail(u.getEmail());
                    dto.setFirstName(u.getFirstName());
                    dto.setLastName(u.getLastName());
                    dto.setBlocked(!u.isActive());
                    dto.setCreatedAt(u.getCreatedAt());
                    return dto;
                }).collect(Collectors.toList());
    }

    @Override public boolean blockUser(String userId) {
        return userRepository.findById(userId).map(u -> { u.setActive(false); userRepository.save(u); return true; }).orElse(false);
    }

    @Override public boolean unblockUser(String userId) {
        return userRepository.findById(userId).map(u -> { u.setActive(true); userRepository.save(u); return true; }).orElse(false);
    }

    @Override @Transactional
    public boolean resetWallet(String userId) {
        Wallet wallet = walletRepository.findByUserId(userId).orElse(null);
        if (wallet == null) return false;
        wallet.setBalance(0.0);
        walletRepository.save(wallet);
        transactionRepository.deleteByUserId(userId);
        alertRepository.deleteByUserId(userId);
        return true;
    }

    @Override
    @Transactional(readOnly = true)
    public SystemAnalyticsDto getSystemAnalytics() {
        List<Transaction> allTransactions = transactionRepository.findAll();

        SystemAnalyticsDto dto = new SystemAnalyticsDto();
        dto.setTotalUsers(userRepository.count());
        dto.setTotalTransactions(allTransactions.size());
        

        dto.setUnresolvedAlerts((int) alertRepository.countByIsReadFalse());
        
        dto.setTotalLeakageDetected(alertRepository.sumTotalLeakageAmount());
        
        dto.setAverageTransactionAmount(allTransactions.stream()
                .mapToDouble(t -> t.getAmount() != null ? t.getAmount() : 0.0)
                .average().orElse(0.0));

       
        String healthStatus = "Good";
        List<RuleExecutionLog> logs = ruleLogRepository.findTop50ByOrderByExecutedAtDesc();
        
        if (logs.isEmpty()) {
            healthStatus = "Unknown";
        } else {
            LocalDateTime lastRun = logs.get(0).getExecutedAt();
            if (lastRun.isBefore(LocalDateTime.now().minusMinutes(2))) {
                healthStatus = "Critical"; 
            } else if (dto.getUnresolvedAlerts() > 50) {
                healthStatus = "Warning"; 
            }
        }
        dto.setSystemHealth(healthStatus);


        Map<YearMonth, DoubleSummaryStatistics> monthlyStats = allTransactions.stream()
                .filter(t -> t.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        t -> YearMonth.from(t.getCreatedAt()), 
                        TreeMap::new,
                        Collectors.summarizingDouble(t -> t.getAmount() != null ? t.getAmount() : 0.0)
                ));

        dto.setMonthlyTransactions(monthlyStats.entrySet().stream()
                .map(e -> {
                    SystemAnalyticsDto.MonthlyTransactionData m = new SystemAnalyticsDto.MonthlyTransactionData();
                    m.setMonth(e.getKey().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
                    m.setAmount(e.getValue().getSum());
                    m.setCount((int) e.getValue().getCount());
                    return m;
                })
                .collect(Collectors.toList()));

        // Category Trends
        dto.setCategoryTrends(allTransactions.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getCategory() != null ? t.getCategory().getName() : "Other",
                        Collectors.summingDouble(t -> t.getAmount() != null ? t.getAmount() : 0.0)))
                .entrySet().stream()
                .map(e -> {
                    SystemAnalyticsDto.CategoryTrend c = new SystemAnalyticsDto.CategoryTrend();
                    c.setCategory(e.getKey());
                    c.setAmount(e.getValue());
                    return c;
                })
                .sorted((a, b) -> Double.compare(b.getAmount(), a.getAmount()))
                .collect(Collectors.toList()));

        // Recent Alerts
        List<LeakageAlert> recentAlerts = alertRepository.findTop5ByOrderByCreatedAtDesc();
        
        dto.setRecentAlerts(recentAlerts.stream()
                .map(a -> {
                    SystemAnalyticsDto.RecentAlertSummary s = new SystemAnalyticsDto.RecentAlertSummary();
                    s.setId(a.getId());
                    s.setRuleName(a.getRuleName());
                    s.setMessage(a.getMessage());
                    s.setSeverity(a.getSeverity() >= 2 ? "High" : "Low");
                    s.setUserEmail(a.getUser() != null ? a.getUser().getEmail() : "Unknown");
                    s.setCreatedAt(a.getCreatedAt());
                    return s;
                }).collect(Collectors.toList()));

        return dto;
    }

    @Override public List<Category> getCategories() { return categoryRepository.findAll(); }

    @Override
    public RuleStatusResponseDto getRulesStatus() {
        RuleStatusResponseDto dto = new RuleStatusResponseDto();
        List<RuleExecutionLog> logs = ruleLogRepository.findTop50ByOrderByExecutedAtDesc();
        List<LeakageAlert> allAlerts = alertRepository.findAll();

        try {
            ObjectMapper mapper = new ObjectMapper();
            ClassPathResource res = new ClassPathResource("rules.json");
            RuleWorkflow[] workflows = mapper.readValue(res.getInputStream(), RuleWorkflow[].class);
            
            List<RuleStatusResponseDto.RuleStatus> rulesList = new ArrayList<>();
            if (workflows != null && workflows.length > 0) {
                int idCounter = 1;
                for (RuleWorkflow.Rule r : workflows[0].getRules()) {
                    RuleStatusResponseDto.RuleStatus s = new RuleStatusResponseDto.RuleStatus();
                    s.setId(idCounter++);
                    s.setName(r.getRuleName());
                    s.setDescription(r.getSuccessEvent());
                    s.setStatus("Active");
                    
                    long triggerCount = allAlerts.stream()
                        .filter(alert -> {
                            String dbName = alert.getRuleName();
                            String jsonName = r.getRuleName();
                            if (dbName == null || jsonName == null) return false;
                            return dbName.replace(" ", "").equalsIgnoreCase(jsonName.replace(" ", ""));
                        })
                        .count();
                    s.setTriggerCount((int) triggerCount);
                    
                    allAlerts.stream()
                        .filter(alert -> {
                             String dbName = alert.getRuleName();
                             if(dbName == null) return false;
                             return dbName.replace(" ","").equalsIgnoreCase(r.getRuleName().replace(" ",""));
                        })
                        .max((a1, a2) -> a1.getCreatedAt().compareTo(a2.getCreatedAt()))
                        .ifPresent(alert -> s.setLastTriggered(alert.getCreatedAt()));
                        
                    rulesList.add(s);
                }
            }
            dto.setRules(rulesList);
            
            if (!logs.isEmpty()) {
                LocalDateTime lastRun = logs.get(0).getExecutedAt();
                dto.setLastExecutionTime(lastRun);
                
                if (lastRun.isAfter(LocalDateTime.now().minusMinutes(2))) {
                    dto.setEngineStatus("Running");
                } else {
                    dto.setEngineStatus("Stalled");
                }
                
                double avgTime = logs.stream()
                    .mapToLong(log -> log.getExecutionTimeMs() != null ? log.getExecutionTimeMs() : 0L)
                    .average()
                    .orElse(0.0);
                dto.setAverageExecutionTime(Math.round(avgTime * 100.0) / 100.0);
                
            } else {
                dto.setEngineStatus("Idle");
                dto.setAverageExecutionTime(0.0);
            }
            
            dto.setAlertsGenerated(allAlerts.size());
            dto.setTotalRulesExecuted(logs.stream().mapToInt(RuleExecutionLog::getUsersProcessed).sum());

        } catch (Exception e) {
            dto.setEngineStatus("Error Loading Rules");
            dto.setRules(new ArrayList<>());
        }
        return dto;
    }
}