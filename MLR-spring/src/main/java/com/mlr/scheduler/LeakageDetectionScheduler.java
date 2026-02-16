package com.mlr.scheduler;

import com.mlr.dto.LeakageContext;
import com.mlr.entity.*;
import com.mlr.repository.*;
import com.mlr.service.RuleExecutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class LeakageDetectionScheduler {

    private static final Logger logger = LoggerFactory.getLogger(LeakageDetectionScheduler.class);

    @Autowired private UserRepository userRepository;
    @Autowired private WalletRepository walletRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private LeakageAlertRepository leakageAlertRepository;
    @Autowired private RuleExecutionLogRepository ruleExecutionLogRepository;
    @Autowired private RuleExecutor ruleExecutor;

    @Scheduled(fixedDelay = 5000)
    @Transactional
    public void processLeakageDetection() {
        LocalDateTime startTime = LocalDateTime.now();
        int usersProcessed = 0;
        int alertsGenerated = 0;

        List<User> users = userRepository.findAll();
        LocalDateTime cutoff30 = LocalDateTime.now().minusDays(30);
        LocalDateTime cutoff60 = LocalDateTime.now().minusDays(60);
        LocalDateTime recentEventWindow = LocalDateTime.now().minusMinutes(2);

        for (User user : users) {
            try {
                Wallet wallet = walletRepository.findByUserId(user.getId()).orElse(null);
                
                List<Transaction> last60Days = transactionRepository.findByUserIdAndCreatedAtAfter(user.getId(), cutoff60);

                List<Transaction> currentPeriod = last60Days.stream()
                        .filter(t -> t.getCreatedAt().isAfter(cutoff30))
                        .collect(Collectors.toList());

                List<Transaction> previousPeriod = last60Days.stream()
                        .filter(t -> t.getCreatedAt().isBefore(cutoff30))
                        .collect(Collectors.toList());

                List<Transaction> currentDebits = currentPeriod.stream().filter(t -> t.getType() == 1).collect(Collectors.toList());
                List<Transaction> currentCredits = currentPeriod.stream().filter(t -> t.getType() == 0).collect(Collectors.toList());
                List<Transaction> previousDebits = previousPeriod.stream().filter(t -> t.getType() == 1).collect(Collectors.toList());

                Map<String, Double> categorySpending = currentDebits.stream()
                        .collect(Collectors.groupingBy(
                                t -> t.getCategory() != null ? t.getCategory().getName() : "Other",
                                Collectors.summingDouble(Transaction::getAmount)
                        ));

                Double entertainmentSpent = categorySpending.getOrDefault("Entertainment", 0.0);

                boolean hasStrictDuplicates = checkForStrictDuplicates(currentDebits, recentEventWindow);

                LeakageContext context = new LeakageContext();
                context.setUserId(user.getId());
                context.setCurrentBalance(wallet != null ? wallet.getBalance() : 0.0);
                context.setRecentTransactions(currentPeriod);
                context.setTotalSpentLast30Days(currentDebits.stream().mapToDouble(Transaction::getAmount).sum());
                context.setDebitCount(currentDebits.size());
                context.setAvgDebit(currentDebits.isEmpty() ? 0.0 : currentDebits.stream().mapToDouble(Transaction::getAmount).average().orElse(0.0));
                
                context.setTotalSpentPrevious30Days(previousDebits.stream().mapToDouble(Transaction::getAmount).sum());
                context.setAverageTransactionAmount(context.getAvgDebit()); 
                context.setTransactionCount(currentDebits.size());
                
                context.setCategorySpending(categorySpending);
                context.setEntertainmentSpent(entertainmentSpent);
                
                context.setHasDuplicateTransactions(hasStrictDuplicates);
                
                context.setSalaryCreditCountLast30Days((int) currentCredits.stream()
                        .filter(t -> "Salary Credit".equalsIgnoreCase(t.getDescription()) || t.getSource() == 0)
                        .count());

                List<LeakageAlert> alerts = ruleExecutor.executeRules(context);

                for (LeakageAlert alert : alerts) {
                    LocalDateTime suppressionTime = getSuppressionWindow(alert.getRuleName());
                    
                    boolean exists = leakageAlertRepository.existsByUserIdAndRuleNameAndCreatedAtAfter(
                            user.getId(), alert.getRuleName(), suppressionTime);

                    if (exists) continue;

                    alert.setUser(user); 
                    alert.setUserId(user.getId()); 
                    if (alert.getCreatedAt() == null) {
                        alert.setCreatedAt(LocalDateTime.now());
                    }

                    leakageAlertRepository.save(alert);
                    alertsGenerated++;
                }

                usersProcessed++;

            } catch (Exception ex) {
                logger.error("Error processing user " + user.getId(), ex);
            }
        }

        if (alertsGenerated > 0) {
            RuleExecutionLog log = new RuleExecutionLog();
            log.setExecutedAt(startTime);
            log.setUsersProcessed(usersProcessed);
            log.setAlertsGenerated(alertsGenerated);
            log.setExecutionTimeMs(Duration.between(startTime, LocalDateTime.now()).toMillis());
            ruleExecutionLogRepository.save(log);

            logger.info("Leakage detection: Users={}, Alerts={}", usersProcessed, alertsGenerated);
        }
    }

    private boolean checkForStrictDuplicates(List<Transaction> debits, LocalDateTime recentEventWindow) {
        Map<String, List<Transaction>> groups = debits.stream()
                .collect(Collectors.groupingBy(t -> 
                    t.getAmount() + "|" + 
                    t.getCategoryId() + "|" + 
                    t.getDescription() + "|" + 
                    t.getUpiId()));

        for (List<Transaction> group : groups.values()) {
            if (group.size() < 2) continue;

            group.sort((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt()));

            for (int i = 0; i < group.size() - 1; i++) {
                Transaction t1 = group.get(i);
                Transaction t2 = group.get(i + 1);

                long minutesDiff = Duration.between(t1.getCreatedAt(), t2.getCreatedAt()).toMinutes();

                if (minutesDiff <= 2) {
                    if (t2.getCreatedAt().isAfter(recentEventWindow)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private LocalDateTime getSuppressionWindow(String ruleName) {
        if ("DuplicateTransactions".equalsIgnoreCase(ruleName)) {
            return LocalDateTime.now().minusMinutes(2);
        }
        return LocalDateTime.now().minusHours(24);
    }
}