using Microsoft.EntityFrameworkCore;
using MLR.DAO;

namespace MLR.DAOImpl;

public class TransactionDao : ITransactionDao
{
    private readonly ApplicationDbContext _context;

    public TransactionDao(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Transaction> CreateAsync(Transaction transaction)
    {
        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();
        return transaction;
    }

    public async Task<List<Transaction>> GetByUserIdAsync(string userId)
    {
        return await _context.Transactions
            .Include(t => t.Category)
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Transaction>> GetRecentByUserIdAsync(string userId, int days)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-days);
        return await _context.Transactions
            .Include(t => t.Category)
            .Where(t => t.UserId == userId && t.CreatedAt >= cutoffDate)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Transaction>> GetAllAsync()
    {
        return await _context.Transactions
            .Include(t => t.Category)
            .ToListAsync();
    }


    public async Task DeleteByUserIdAsync(string userId)
    {
        var transactions = await _context.Transactions
            .Where(t => t.UserId == userId)
            .ToListAsync();

        if (transactions.Any())
        {
            _context.Transactions.RemoveRange(transactions);
            await _context.SaveChangesAsync();
        }
    }
}