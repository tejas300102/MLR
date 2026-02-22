using MLR.DAO;
using MLR.DTOs;
using System.Globalization;

namespace MLR.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly ITransactionDao _transactionDao;
    private readonly ILeakageAlertDao _leakageAlertDao;

    public AnalyticsService(ITransactionDao transactionDao, ILeakageAlertDao leakageAlertDao)
    {
        _transactionDao = transactionDao;
        _leakageAlertDao = leakageAlertDao;
    }

    public async Task<object> GetSpendingAnalyticsAsync(string userId)
    {
        var transactions = await _transactionDao.GetRecentByUserIdAsync(userId, 30);
        var debits = transactions.Where(t => t.Type == 1).ToList();  // 1 = Debit

        var categorySpending = debits.GroupBy(t => t.Category.Name)
            .Select(g => new { Category = g.Key, Amount = g.Sum(t => t.Amount) })
            .ToList();

        var dailySpending = debits.GroupBy(t => t.CreatedAt.Date)
            .Select(g => new { Date = g.Key, Amount = g.Sum(t => t.Amount) })
            .OrderBy(x => x.Date)
            .ToList();

        return new
        {
            TotalSpent = debits.Sum(t => t.Amount),
            CategoryBreakdown = categorySpending,
            DailySpending = dailySpending,
            TransactionCount = debits.Count
        };
    }

    public async Task<List<LeakageAlertDto>> GetLeakageAlertsAsync(string userId)
    {
        var alerts = await _leakageAlertDao.GetByUserIdAsync(userId);
        return alerts.Select(a => new LeakageAlertDto
        {
            Id = a.Id,
            RuleName = a.RuleName,
            Message = a.Message,
            Severity = GetSeverityString(a.Severity),
            IsRead = a.IsRead, // Map the IsRead property
            CreatedAt = DateTime.SpecifyKind(a.CreatedAt, DateTimeKind.Utc)
        }).ToList();
    }

    public async Task<bool> MarkAlertAsReadAsync(string userId, int alertId)
    {
        return await _leakageAlertDao.MarkAsReadAsync(alertId, userId);
    }

    private string GetSeverityString(int severity)
    {
        return severity switch
        {
            0 => "Low",
            1 => "Medium",
            2 => "High",
            3 => "Critical",
            _ => "Unknown"
        };
    }

    public async Task<object> GetLeakageAnalyticsAsync(string userId)
    {
        var transactions = await _transactionDao.GetByUserIdAsync(userId);
        var debits = transactions.Where(t => t.Type == 1).ToList();

        var monthlyLeakage = debits
            .GroupBy(t => new { t.CreatedAt.Year, t.CreatedAt.Month })
            .Select(g => new {
                Year = g.Key.Year,
                MonthNum = g.Key.Month,
                Amount = g.Sum(t => t.Amount)
            })
            .OrderBy(x => x.Year)
            .ThenBy(x => x.MonthNum)
            .ToList()
            .Select(x => new {
                Month = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(x.MonthNum),
                Amount = x.Amount
            }).ToList();

        var categoryLeakage = debits
            .GroupBy(t => t.Category.Name)
            .Select(g => new {
                Category = g.Key,
                Amount = g.Sum(t => t.Amount)
            }).ToList();

        return new
        {
            MonthlyLeakage = monthlyLeakage,
            CategoryLeakage = categoryLeakage,
            TotalLeakage = debits.Sum(t => t.Amount),
            AverageMonthly = monthlyLeakage.Any() ? monthlyLeakage.Average(m => m.Amount) : 0
        };
    }
}