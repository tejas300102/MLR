using MLR.DAO;

namespace MLR.DAO;

public interface ILeakageAlertDao
{
    Task<LeakageAlert> CreateAsync(LeakageAlert alert);
    Task<List<LeakageAlert>> GetByUserIdAsync(string userId);
    Task<List<LeakageAlert>> GetUnresolvedAsync();
    Task<bool> ExistsRecentAsync(string userId, string ruleName, DateTime sinceUtc);
    Task<List<LeakageAlert>> GetAllAsync();
    Task DeleteByUserIdAsync(string userId);
    // Added method for Mark as Read
    Task<bool> MarkAsReadAsync(int id, string userId);
}