package com.mlr.service;

import com.mlr.dto.AddMoneyDto;
import com.mlr.dto.PaymentDto;
import com.mlr.dto.TransactionDto;
import com.mlr.dto.WalletBalanceDto;

import java.util.List;

public interface WalletService {
    WalletBalanceDto getBalance(String userId);
    WalletBalanceDto addMoney(String userId, AddMoneyDto addMoneyDto);
    WalletBalanceDto pay(String userId, PaymentDto paymentDto);
    List<TransactionDto> getRecentTransactions(String userId, int limit);
}