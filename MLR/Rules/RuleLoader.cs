using RulesEngine.Models;

namespace MLR.Rules;

public static class RuleLoader
{
    public static List<Workflow> LoadRules()
    {
        var rules = new List<Rule>
        {
            // 1. Duplicate Transactions
            new Rule
            {
                RuleName = "DuplicateTransactions",
                Expression = "HasDuplicateTransactions == true",
                SuccessEvent = "Duplicate transactions detected"
            },
            // 2. Irregular Spending
            new Rule
            {
                RuleName = "IrregularSpending",
                Expression = "AvgDebit > 1000 && DebitCount < 5",
                SuccessEvent = "Irregular spending pattern detected"
            },
            new Rule
            {
                 RuleName = "ExcessiveEntertainment",
                Expression = "EntertainmentSpent > 1000 && EntertainmentSpent > (TotalSpentLast30Days * 0.30)",
                SuccessEvent = "Excessive entertainment spending detected (exceeds 30% of total budget)"
            },
            // 4. Duplicate Salary Credit
            new Rule
            {
                RuleName = "DuplicateSalaryCredit",
                Expression = "SalaryCreditCountLast30Days > 1",
                SuccessEvent = "Duplicate salary credit detected (salary should be credited only once per month)"
            },
            // 5. Overspending vs Previous Month
            new Rule
            {
                RuleName = "OverspendingVsPreviousMonth",
                Expression = "TotalSpentPrevious30Days > 0 && TotalSpentLast30Days > TotalSpentPrevious30Days * 1.5",
                SuccessEvent = "Spending increased sharply compared to last month"
            }
        };

        return new List<Workflow>
        {
            new Workflow
            {
                WorkflowName = "MoneyLeakageRules",
                Rules = rules
            }
        };
    }
}