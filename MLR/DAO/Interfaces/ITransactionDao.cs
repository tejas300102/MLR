namespace MLR.DAO;

public interface ITransactionDao
{
    Task<Transaction> CreateAsync(Transaction transaction);
    Task<List<Transaction>> GetByUserIdAsync(string userId);
    Task<List<Transaction>> GetRecentByUserIdAsync(string userId, int days);
    Task<List<Transaction>> GetAllAsync();
    Task DeleteByUserIdAsync(string userId);
}