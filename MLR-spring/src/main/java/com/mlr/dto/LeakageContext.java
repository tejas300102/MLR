package com.mlr.dto;

import com.mlr.entity.Transaction;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class LeakageContext {
    private String userId;
    private Double currentBalance;

  
    private List<Transaction> recentTransactions;
    private Double totalSpentLast30Days;
    private int debitCount;
    private Double avgDebit;


    private Double totalSpentPrevious30Days;


    private Double averageTransactionAmount;
    private int transactionCount;

    private Map<String, Double> categorySpending;
    private Double entertainmentSpent;

    private boolean hasDuplicateTransactions;
    private int salaryCreditCountLast30Days;
}