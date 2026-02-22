namespace MLR.DAO;

public interface IWalletDao
{
    Task<Wallet?> GetByUserIdAsync(string userId);
    Task<Wallet> CreateAsync(Wallet wallet);
    Task<Wallet> UpdateAsync(Wallet wallet);
}
