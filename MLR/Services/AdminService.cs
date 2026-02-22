using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MLR.DAO;
using MLR.DTOs;
using System.Globalization;

namespace MLR.Services;

public class AdminService : IAdminService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IWalletDao _walletDao;
    private readonly ITransactionDao _transactionDao;
    private readonly ILeakageAlertDao _leakageAlertDao;
    private readonly ICategoryDao _categoryDao;
    private readonly IRuleExecutionLogDao _ruleExecutionLogDao;

    public AdminService(UserManager<ApplicationUser> userManager, IWalletDao walletDao,
        ITransactionDao transactionDao, ILeakageAlertDao leakageAlertDao, ICategoryDao categoryDao, IRuleExecutionLogDao ruleExecutionLogDao)
    {
        _userManager = userManager;
        _walletDao = walletDao;
        _transactionDao = transactionDao;
        _leakageAlertDao = leakageAlertDao;
        _categoryDao = categoryDao;
        _ruleExecutionLogDao = ruleExecutionLogDao;
    }

    public async Task<List<ApplicationUser>> GetAllUsersAsync(string? search = null)
    {
        // Start with a queryable to allow DB-side filtering
        var query = _userManager.Users.AsQueryable();

        // Apply search filter if provided
        if (!string.IsNullOrWhiteSpace(search))
        {
            search = search.Trim().ToLower();
            // Filter by Email, FirstName, or LastName (Case insensitive check depending on DB collation, usually safe)
            query = query.Where(u =>
                u.Email.ToLower().Contains(search) ||
                u.FirstName.ToLower().Contains(search) ||
                u.LastName.ToLower().Contains(search));
        }

        var users = await query.ToListAsync();
        var nonAdminUsers = new List<ApplicationUser>();

        foreach (var user in users)
        {
            if (!await _userManager.IsInRoleAsync(user, "ADMIN")) nonAdminUsers.Add(user);
        }
        return nonAdminUsers;
    }

    public async Task<bool> BlockUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;
        user.IsActive = false;
        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded;
    }

    public async Task<bool> UnblockUserAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;
        user.IsActive = true;
        var result = await _userManager.UpdateAsync(user);
        return result.Succeeded;
    }


    public async Task<bool> ResetWalletAsync(string userId)
    {
        var wallet = await _walletDao.GetByUserIdAsync(userId);
        if (wallet == null) return false;

        // 1. Reset Balance
        wallet.Balance = 0;
        await _walletDao.UpdateAsync(wallet);

        // 2. Clear Transaction History
        await _transactionDao.DeleteByUserIdAsync(userId);

        // 3. Clear Leakage Alerts
        await _leakageAlertDao.DeleteByUserIdAsync(userId);

        return true;
    }

    public async Task<object> GetSystemAnalyticsAsync()
    {
        var totalUsers = await _userManager.Users.CountAsync();
        var allAlerts = await _leakageAlertDao.GetAllAsync();
        var allTransactions = await _transactionDao.GetAllAsync();

        var totalLeakageAmount = allAlerts.Sum(a => a.Amount ?? 0);
        var avgTransactionAmount = allTransactions.Any() ? allTransactions.Average(t => t.Amount) : 0;

        var monthlyData = allTransactions
            .Where(t => t.CreatedAt >= DateTime.UtcNow.AddMonths(-6))
            .GroupBy(t => new { t.CreatedAt.Year, t.CreatedAt.Month })
            .Select(g => new { Year = g.Key.Year, MonthNum = g.Key.Month, Count = g.Count(), Amount = g.Sum(t => t.Amount) })
            .OrderBy(x => x.Year).ThenBy(x => x.MonthNum).ToList()
            .Select(x => new { Month = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(x.MonthNum), Count = x.Count, Amount = x.Amount }).ToList();

        var categoryData = allTransactions
            .GroupBy(t => t.Category?.Name ?? "Uncategorized")
            .Select(g => new { Category = g.Key, Amount = g.Sum(t => t.Amount) })
            .OrderByDescending(x => x.Amount).ToList();

        var recentAlerts = allAlerts.Take(5).Select(a => new {
            Id = a.Id,
            RuleName = a.RuleName,
            Message = a.Message,
            Severity = GetSeverityString(a.Severity),
            CreatedAt = DateTime.SpecifyKind(a.CreatedAt, DateTimeKind.Utc),
            UserEmail = a.User?.Email ?? "Unknown"
        }).ToList();

        return new
        {
            TotalUsers = totalUsers,
            TotalTransactions = allTransactions.Count,
            UnresolvedAlerts = allAlerts.Count(a => !a.IsRead),
            RecentAlerts = recentAlerts,
            TotalLeakageDetected = totalLeakageAmount,
            AverageTransactionAmount = avgTransactionAmount,
            MonthlyTransactions = monthlyData,
            CategoryTrends = categoryData,
            AlertsByUser = allAlerts.GroupBy(a => a.UserId).Count()
        };
    }

    public async Task<List<Category>> GetCategoriesAsync()
    {
        return await _categoryDao.GetAllAsync();
    }

    public async Task<object> GetRulesStatusAsync()
    {
        var logs = await _ruleExecutionLogDao.GetRecentLogsAsync(50);
        var lastLog = logs.FirstOrDefault();

        var allAlerts = await _leakageAlertDao.GetAllAsync();
        var alertStats = allAlerts
            .GroupBy(a => a.RuleName)
            .Select(g => new
            {
                Name = g.Key,
                Count = g.Count(),
                LastTriggered = g.Max(a => a.CreatedAt)
            })
            .ToDictionary(x => x.Name);

        var definitions = new[]
        {
            new { Name = "DuplicateTransactions", Description = "Detects identical transactions within 24 hours." },
            new { Name = "CategoryMismatch", Description = "Flags category spending exceeding 50% of total." },
            new { Name = "OverspendingSpike", Description = "Alerts when 30-day spending exceeds 2x current balance." },
            new { Name = "DuplicateSalaryCredit", Description = "Detects multiple salary credits in a single month." },
            new { Name = "OverspendingVsPreviousMonth", Description = "Flags if current spending is 1.5x higher than last month." },
            new { Name = "ExcessiveEntertainment", Description = "Flags entertainment spending > 1000 and > 30% of budget." }
        };

        var ruleStatuses = definitions.Select((def, index) => {
            alertStats.TryGetValue(def.Name, out var stat);
            return new
            {
                Id = index + 1,
                Name = def.Name,
                Status = "Active",
                Description = def.Description,
                TriggerCount = stat?.Count ?? 0,
                LastTriggered = stat != null
                    ? DateTime.SpecifyKind(stat.LastTriggered, DateTimeKind.Utc)
                    : (DateTime?)null
            };
        }).ToList();

        return new
        {
            EngineStatus = "Running",
            LastExecutionTime = lastLog != null
                ? DateTime.SpecifyKind(lastLog.ExecutedAt, DateTimeKind.Utc)
                : (DateTime?)null,
            TotalRulesExecuted = logs.Sum(l => l.UsersProcessed) * definitions.Length,
            AlertsGenerated = allAlerts.Count,
            AverageExecutionTime = logs.Any() ? Math.Round(logs.Average(l => l.ExecutionTime.TotalMilliseconds), 2) : 0,
            Rules = ruleStatuses
        };
    }

    private string GetSeverityString(int severity)
    {
        return severity switch { 0 => "Low", 1 => "Medium", 2 => "High", 3 => "Critical", _ => "Unknown" };
    }
}