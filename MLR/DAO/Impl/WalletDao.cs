using Microsoft.EntityFrameworkCore;
using MLR.DAO;

namespace MLR.DAOImpl;

public class WalletDao : IWalletDao
{
    private readonly ApplicationDbContext _context;

    public WalletDao(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Wallet?> GetByUserIdAsync(string userId)
    {
        return await _context.Wallets.FirstOrDefaultAsync(w => w.UserId == userId);
    }

    public async Task<Wallet> CreateAsync(Wallet wallet)
    {
        _context.Wallets.Add(wallet);
        await _context.SaveChangesAsync();
        return wallet;
    }

    public async Task<Wallet> UpdateAsync(Wallet wallet)
    {
        wallet.UpdatedAt = DateTime.UtcNow;
        _context.Wallets.Update(wallet);
        await _context.SaveChangesAsync();
        return wallet;
    }
}
