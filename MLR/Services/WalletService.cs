using MLR.DAO;
using MLR.DTOs;

namespace MLR.Services;

public class WalletService : IWalletService
{
    private readonly IWalletDao _walletDao;
    private readonly ITransactionDao _transactionDao;
    private readonly ICategoryDao _categoryDao;

    public WalletService(IWalletDao walletDao, ITransactionDao transactionDao, ICategoryDao categoryDao)
    {
        _walletDao = walletDao;
        _transactionDao = transactionDao;
        _categoryDao = categoryDao;
    }

    public async Task<WalletBalanceDto> GetBalanceAsync(string userId)
    {
        var wallet = await _walletDao.GetByUserIdAsync(userId);
        return new WalletBalanceDto { Balance = wallet?.Balance ?? 0 };
    }

    public async Task<WalletBalanceDto> AddMoneyAsync(string userId, AddMoneyDto addMoneyDto)
    {
        var wallet = await _walletDao.GetByUserIdAsync(userId);
        if (wallet == null)
        {
            wallet = await _walletDao.CreateAsync(new Wallet { UserId = userId });
        }

        wallet.Balance += addMoneyDto.Amount;
        await _walletDao.UpdateAsync(wallet);

        string sourceInput = addMoneyDto.Source?.Trim() ?? "Salary";
        int sourceValue = sourceInput.ToLower() switch
        {
            "salary" => 0,
            "cash" => 1,
            "refund" => 2,
            _ => 1 // Default to Cash
        };

        string description;
        if (string.Equals(sourceInput, "Cash", StringComparison.OrdinalIgnoreCase))
        {
            description = "Money added via Other";
        }
        else
        {
            description = $"Money added via {sourceInput}";
        }

        int otherCategoryId = 8;

        await _transactionDao.CreateAsync(new Transaction
        {
            UserId = userId,
            Amount = addMoneyDto.Amount,
            Type = 0,  // Credit
            Source = sourceValue,
            Description = description,
            CategoryId = otherCategoryId
        });

        return new WalletBalanceDto { Balance = wallet.Balance };
    }

    public async Task<WalletBalanceDto> PayAsync(string userId, PaymentDto paymentDto)
    {
        var wallet = await _walletDao.GetByUserIdAsync(userId);
        if (wallet == null || wallet.Balance < paymentDto.Amount)
            throw new InvalidOperationException("Insufficient balance");

        var category = await _categoryDao.GetByIdAsync(paymentDto.CategoryId);
        if (category == null) throw new ArgumentException("Invalid category");

        wallet.Balance -= paymentDto.Amount;
        await _walletDao.UpdateAsync(wallet);

        await _transactionDao.CreateAsync(new Transaction
        {
            UserId = userId,
            Amount = paymentDto.Amount,
            Type = 1,  // 1 = Debit
            Source = 3,  // 3 = Payment
            Description = paymentDto.Description,
            CategoryId = paymentDto.CategoryId,
            UpiId = paymentDto.UpiId // Map UPI ID here
        });

        return new WalletBalanceDto { Balance = wallet.Balance };
    }

    public async Task<List<TransactionDto>> GetRecentTransactionsAsync(string userId, int limit)
    {
        var transactions = await _transactionDao.GetByUserIdAsync(userId);
        return transactions.Take(limit).Select(t => new TransactionDto
        {
            Id = t.Id,
            Amount = t.Amount,
            Type = t.Type == 0 ? "CREDIT" : "DEBIT",
            Description = t.Description,
            CategoryName = t.Category?.Name ?? "Unknown",
            UpiId = t.UpiId, // Map UPI ID here for the history view
            CreatedAt = DateTime.SpecifyKind(t.CreatedAt, DateTimeKind.Utc)
        }).ToList();
    }
}