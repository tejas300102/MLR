package com.mlr.service.impl;

import com.mlr.dto.AddMoneyDto;
import com.mlr.dto.PaymentDto;
import com.mlr.dto.TransactionDto;
import com.mlr.dto.WalletBalanceDto;
import com.mlr.entity.Transaction;
import com.mlr.entity.User;
import com.mlr.entity.Wallet;
import com.mlr.repository.CategoryRepository;
import com.mlr.repository.TransactionRepository;
import com.mlr.repository.UserRepository;
import com.mlr.repository.WalletRepository;
import com.mlr.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WalletServiceImpl implements WalletService {

    @Autowired private WalletRepository walletRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private UserRepository userRepository; 

    @Override
    public WalletBalanceDto getBalance(String userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElse(new Wallet(userId, 0.0));
        return new WalletBalanceDto(wallet.getBalance());
    }

    @Override
    @Transactional
    public WalletBalanceDto addMoney(String userId, AddMoneyDto dto) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Wallet w = new Wallet(userId, 0.0);
                    return walletRepository.save(w);
                });

        wallet.setBalance(wallet.getBalance() + dto.getAmount());
        walletRepository.save(wallet);

      
        String sourceInput = (dto.getSource() != null) ? dto.getSource().trim() : "Salary";
        int sourceValue;
        switch (sourceInput.toLowerCase()) {
            case "salary": sourceValue = 0; break;
            case "cash": sourceValue = 1; break;
            case "refund": sourceValue = 2; break;
            default: sourceValue = 1; 
        }

        String description;
        if ("Cash".equalsIgnoreCase(sourceInput)) {
            description = "Money added via Other";
        } else {
            description = "Money added via " + sourceInput;
        }

        Transaction t = new Transaction();
        t.setUserId(userId);
        t.setAmount(dto.getAmount());
        t.setType(0); 
        t.setSource(sourceValue);
        t.setDescription(description);
        t.setCategoryId(8); 
        
        transactionRepository.save(t);

        return new WalletBalanceDto(wallet.getBalance());
    }

    @Override
    @Transactional
    public WalletBalanceDto pay(String userId, PaymentDto dto) {
        Wallet wallet = walletRepository.findByUserId(userId).orElse(null);
        if (wallet == null || wallet.getBalance() < dto.getAmount()) {
            throw new IllegalStateException("Insufficient balance");
        }

        if (!categoryRepository.existsById(dto.getCategoryId())) {
            throw new IllegalArgumentException("Invalid category");
        }

        wallet.setBalance(wallet.getBalance() - dto.getAmount());
        walletRepository.save(wallet);

        Transaction t = new Transaction();
        t.setUserId(userId);
        t.setAmount(dto.getAmount());
        t.setType(1); // Debit
        t.setSource(3); // Payment
        t.setDescription(dto.getDescription());
        t.setCategoryId(dto.getCategoryId());
        t.setUpiId(dto.getUpiId());

        transactionRepository.save(t);

        return new WalletBalanceDto(wallet.getBalance());
    }

    @Override
    public List<TransactionDto> getRecentTransactions(String userId, int limit) {
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return transactions.stream().limit(limit).map(this::mapToDto).collect(Collectors.toList());
    }

    private TransactionDto mapToDto(Transaction t) {
        TransactionDto dto = new TransactionDto();
        dto.setId(t.getId());
        dto.setAmount(t.getAmount());
        dto.setType(t.getType() == 0 ? "CREDIT" : "DEBIT");
        dto.setDescription(t.getDescription());
        dto.setCategoryName(t.getCategory() != null ? t.getCategory().getName() : "Unknown");
        dto.setUpiId(t.getUpiId());
        dto.setCreatedAt(t.getCreatedAt());
        return dto;
    }
}