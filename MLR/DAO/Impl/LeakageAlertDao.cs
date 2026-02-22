using Microsoft.EntityFrameworkCore;
using MLR.DAO;

namespace MLR.DAOImpl;

public class LeakageAlertDao : ILeakageAlertDao
{
    private readonly ApplicationDbContext _context;

    public LeakageAlertDao(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LeakageAlert> CreateAsync(LeakageAlert alert)
    {
        _context.LeakageAlerts.Add(alert);
        await _context.SaveChangesAsync();
        return alert;
    }

    public async Task<List<LeakageAlert>> GetByUserIdAsync(string userId)
    {
        return await _context.LeakageAlerts
            .Where(l => l.UserId == userId)
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<LeakageAlert>> GetUnresolvedAsync()
    {
        return await _context.LeakageAlerts
            .Where(l => !l.IsRead)
            .ToListAsync();
    }

    public async Task<bool> ExistsRecentAsync(string userId, string ruleName, DateTime sinceUtc)
    {
        return await _context.LeakageAlerts.AnyAsync(a =>
            a.UserId == userId &&
            a.RuleName == ruleName &&
            a.CreatedAt >= sinceUtc);
    }

    public async Task<List<LeakageAlert>> GetAllAsync()
    {
        return await _context.LeakageAlerts
            .Include(l => l.User)
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync();
    }

    public async Task DeleteByUserIdAsync(string userId)
    {
        var alerts = await _context.LeakageAlerts
            .Where(l => l.UserId == userId)
            .ToListAsync();

        if (alerts.Any())
        {
            _context.LeakageAlerts.RemoveRange(alerts);
            await _context.SaveChangesAsync();
        }
    }

    // Implementation of MarkAsReadAsync
    public async Task<bool> MarkAsReadAsync(int id, string userId)
    {
        var alert = await _context.LeakageAlerts
            .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (alert == null) return false;

        alert.IsRead = true;
        await _context.SaveChangesAsync();
        return true;
    }
}