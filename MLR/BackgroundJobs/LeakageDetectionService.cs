using Microsoft.AspNetCore.Identity;
using MLR.DAO;
using MLR.Rules;

namespace MLR.BackgroundJobs;

public class LeakageDetectionService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<LeakageDetectionService> _logger;

    public LeakageDetectionService(IServiceProvider serviceProvider, ILogger<LeakageDetectionService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessLeakageDetection();

                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in leakage detection service");
                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            }
        }
    }

    private async Task ProcessLeakageDetection()
    {
        using var scope = _serviceProvider.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var walletDao = scope.ServiceProvider.GetRequiredService<IWalletDao>();
        var transactionDao = scope.ServiceProvider.GetRequiredService<ITransactionDao>();
        var leakageAlertDao = scope.ServiceProvider.GetRequiredService<ILeakageAlertDao>();
        var ruleExecutionLogDao = scope.ServiceProvider.GetRequiredService<IRuleExecutionLogDao>();

        var startTime = DateTime.UtcNow;
        var usersProcessed = 0;
        var alertsGenerated = 0;

        // Process all users
        var users = userManager.Users.ToList();
        var ruleExecutor = new RuleExecutor();

        // 30-day Cutoff for splitting Current vs Previous
        var cutoff30 = DateTime.UtcNow.AddDays(-30);

      
        // trigger if the latest duplicate happened in the last 2 minutes.
        var recentEventWindow = DateTime.UtcNow.AddMinutes(-2);

        foreach (var user in users)
        {
            try
            {
                var wallet = await walletDao.GetByUserIdAsync(user.Id);

              
                var last60DaysTransactions = await transactionDao.GetRecentByUserIdAsync(user.Id, 60);

        
                var currentPeriod = last60DaysTransactions.Where(t => t.CreatedAt >= cutoff30).ToList();
                var previousPeriod = last60DaysTransactions.Where(t => t.CreatedAt < cutoff30).ToList();

                var currentDebits = currentPeriod.Where(t => t.Type == 1).ToList();
                var currentCredits = currentPeriod.Where(t => t.Type == 0).ToList();

       
                var previousDebits = previousPeriod.Where(t => t.Type == 1).ToList();

              
                var categorySpending = currentDebits
                    .Where(t => t.Category != null)
                    .GroupBy(t => t.Category!.Name)
                    .ToDictionary(g => g.Key, g => g.Sum(t => t.Amount));

                categorySpending.TryGetValue("Entertainment", out var entertainmentSpent);

                bool hasStrictDuplicates = CheckForStrictDuplicates(currentDebits, recentEventWindow);

                var context = new LeakageContext
                {
                    UserId = user.Id,
                    CurrentBalance = wallet?.Balance ?? 0,

          
                    RecentTransactions = currentPeriod,
                    TotalSpentLast30Days = currentDebits.Sum(t => t.Amount),
                    DebitCount = currentDebits.Count,
                    AvgDebit = currentDebits.Any() ? currentDebits.Average(t => t.Amount) : 0,

   
                    TotalSpentPrevious30Days = previousDebits.Sum(t => t.Amount),

  
                    AverageTransactionAmount = currentDebits.Any() ? currentDebits.Average(t => t.Amount) : 0,
                    TransactionCount = currentDebits.Count,

                    CategorySpending = categorySpending,
                    EntertainmentSpent = entertainmentSpent,

               
                    HasDuplicateTransactions = hasStrictDuplicates,

        
                    SalaryCreditCountLast30Days = currentCredits.Count(t => t.Description == "Salary Credit" || t.Source == 0)
                };

                var alerts = await ruleExecutor.ExecuteRulesAsync(context);

                foreach (var alert in alerts)
                {
                   
                 
                    var suppressionWindow = GetSuppressionWindow(alert.RuleName);

                    var dedupeSince = DateTime.UtcNow.Subtract(suppressionWindow);

      
                    var exists = await leakageAlertDao.ExistsRecentAsync(alert.UserId, alert.RuleName, dedupeSince);

                    if (exists) continue;

                    await leakageAlertDao.CreateAsync(alert);
                    alertsGenerated++;
                }

                usersProcessed++;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing user {UserId}", user.Id);
            }
        }

        var executionTime = DateTime.UtcNow - startTime;

    
        if (alertsGenerated > 0)
        {
            await ruleExecutionLogDao.CreateAsync(new RuleExecutionLog
            {
                ExecutedAt = startTime,
                UsersProcessed = usersProcessed,
                AlertsGenerated = alertsGenerated,
                ExecutionTime = executionTime
            });

            _logger.LogInformation(
                "Leakage detection completed. Users: {Users}, Alerts: {Alerts}, Time: {Time}ms",
                usersProcessed, alertsGenerated, executionTime.TotalMilliseconds
            );
        }
    }

 
    private bool CheckForStrictDuplicates(List<Transaction> debits, DateTime recentEventWindow)
    {

        var groups = debits.GroupBy(t => new { t.Amount, t.CategoryId, t.Description, t.UpiId });

        foreach (var group in groups)
        {
   
            if (group.Count() < 2) continue;

            var sortedTransactions = group.OrderBy(t => t.CreatedAt).ToList();

            for (int i = 0; i < sortedTransactions.Count - 1; i++)
            {
                var timeDiff = sortedTransactions[i + 1].CreatedAt - sortedTransactions[i].CreatedAt;

               
                if (timeDiff <= TimeSpan.FromMinutes(2))
                {
               
                    if (sortedTransactions[i + 1].CreatedAt >= recentEventWindow)
                    {
                        return true;
                    }
                }
            }
        }

        return false;
    }


    private TimeSpan GetSuppressionWindow(string ruleName)
    {
        
        if (ruleName.Equals("DuplicateTransactions", StringComparison.OrdinalIgnoreCase))
        {
            return TimeSpan.FromMinutes(2);
        }

   
        return TimeSpan.FromHours(24);
    }
}