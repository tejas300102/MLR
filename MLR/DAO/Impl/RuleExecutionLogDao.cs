using Microsoft.EntityFrameworkCore;
using MLR.DAO;

namespace MLR.DAOImpl;

public class RuleExecutionLogDao : IRuleExecutionLogDao
{
    private readonly ApplicationDbContext _context;

    public RuleExecutionLogDao(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<RuleExecutionLog> CreateAsync(RuleExecutionLog log)
    {
        _context.RuleExecutionLogs.Add(log);
        await _context.SaveChangesAsync();
        return log;
    }

    public async Task<List<RuleExecutionLog>> GetRecentLogsAsync(int count)
    {
        return await _context.RuleExecutionLogs
            .OrderByDescending(l => l.ExecutedAt)
            .Take(count)
            .ToListAsync();
    }
}
