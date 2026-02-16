package com.mlr.service;

import com.mlr.dto.TransactionDto;
import java.util.List;

public interface TransactionService {
    List<TransactionDto> getTransactionHistory(String userId);
    TransactionDto getTransactionDetails(String userId, Long transactionId);
}