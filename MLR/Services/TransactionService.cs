using MLR.DAO;
using MLR.DTOs;

namespace MLR.Services;

public class TransactionService : ITransactionService
{
    private readonly ITransactionDao _transactionDao;

    public TransactionService(ITransactionDao transactionDao)
    {
        _transactionDao = transactionDao;
    }

    public async Task<List<TransactionDto>> GetTransactionHistoryAsync(string userId)
    {
        var transactions = await _transactionDao.GetByUserIdAsync(userId);
        return transactions.Select(t => new TransactionDto
        {
            Id = t.Id,
            Amount = t.Amount,
            Type = GetTypeString(t.Type),  
            Description = t.Description,
            CategoryName = t.Category.Name,
            CreatedAt = DateTime.SpecifyKind(t.CreatedAt, DateTimeKind.Utc)
        }).ToList();
    }

    private string GetTypeString(int type)
    {
        return type switch
        {
            0 => "CREDIT",
            1 => "DEBIT",
            _ => "UNKNOWN"
        };
    }

    public async Task<TransactionDto?> GetTransactionDetailsAsync(string userId, int transactionId)
    {
        var transactions = await _transactionDao.GetByUserIdAsync(userId);
        var transaction = transactions.FirstOrDefault(t => t.Id == transactionId);

        if (transaction == null) return null;

        return new TransactionDto
        {
            Id = transaction.Id,
            Amount = transaction.Amount,
            Type = GetTypeString(transaction.Type),  
            Description = transaction.Description,
            CategoryName = transaction.Category.Name,
            CreatedAt = DateTime.SpecifyKind(transaction.CreatedAt, DateTimeKind.Utc)
        };
    }
}