using RulesEngine.Models;
using MLR.DAO;

namespace MLR.Rules;

public class RuleExecutor
{
    private readonly ExternalRulesEngine.RulesEngine _rulesEngine;

    public RuleExecutor()
    {
        var workflows = RuleLoader.LoadRules();
        _rulesEngine = new ExternalRulesEngine.RulesEngine(workflows.ToArray());
    }

    public async Task<List<LeakageAlert>> ExecuteRulesAsync(LeakageContext context)
    {
        var alerts = new List<LeakageAlert>();
        var workflowNames = new[] { "MoneyLeakageRules" };

        foreach (var workflowName in workflowNames)
        {
            var ruleResults = await _rulesEngine.ExecuteAllRulesAsync(workflowName, context);

            // Log failures 
            foreach (var r in ruleResults)
            {
                if (!r.IsSuccess && !string.IsNullOrWhiteSpace(r.ExceptionMessage))
                    Console.WriteLine($"Rule failed: {r.Rule.RuleName} => {r.ExceptionMessage}");
            }

            // Process Successes
            foreach (var result in ruleResults.Where(r => r.IsSuccess))
            {
                alerts.Add(new LeakageAlert
                {
                    UserId = context.UserId,
                    RuleName = result.Rule.RuleName,
                    Message = result.Rule.SuccessEvent ?? "Money leakage detected",
                    Severity = GetSeverityInt(result.Rule.RuleName),

                    Amount = GetLeakageAmount(result.Rule.RuleName, context),

                    CreatedAt = DateTime.UtcNow
                });
            }
        }

        return alerts;
    }

    private int GetSeverityInt(string ruleName)
    {
        return ruleName.ToLower() switch
        {
            var name when name.Contains("overspending") => 2, // High
            var name when name.Contains("entertainment") => 2,
            var name when name.Contains("duplicate") => 1,    // Medium
            _ => 0                                            // Low
        };
    }

    private decimal? GetLeakageAmount(string ruleName, LeakageContext context)
    {
        var name = ruleName.ToLower();

        if (name.Contains("category"))
        {
  
            return context.EntertainmentSpent;
        }

        if (name.Contains("overspending"))
        {
            return context.TotalSpentLast30Days;
        }

        if (name.Contains("duplicate"))
        {

            return context.AvgDebit;
        }

        return 0;
    }
}