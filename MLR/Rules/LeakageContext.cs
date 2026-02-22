using MLR.DAO;

namespace MLR.Rules;

public class LeakageContext
{
    public string UserId { get; set; } = string.Empty;

    public decimal CurrentBalance { get; set; }

    public List<Transaction> RecentTransactions { get; set; } = new();

    public decimal TotalSpentLast30Days { get; set; }
    public decimal AverageTransactionAmount { get; set; }
    public int TransactionCount { get; set; }
    public Dictionary<string, decimal> CategorySpending { get; set; } = new();

    public bool HasDuplicateTransactions { get; set; }
    public decimal EntertainmentSpent { get; set; }
    public int DebitCount { get; set; }
    public decimal AvgDebit { get; set; }
    public int SalaryCreditCountLast30Days { get; set; }

    public decimal TotalSpentPrevious30Days { get; set; }
}
