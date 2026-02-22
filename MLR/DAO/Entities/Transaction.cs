using System.ComponentModel.DataAnnotations;

namespace MLR.DAO;

public class Transaction
{
    [Key]
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    // 0 = Credit, 1 = Debit
    public int Type { get; set; } = 0;

    // 0=Salary, 1=Cash, 2=Refund, 3=Payment
    public int Source { get; set; } = 0;

    public string Description { get; set; } = string.Empty;

    public string? Merchant { get; set; }

    // Added UPI ID field
    public string? UpiId { get; set; }

    public int CategoryId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual ApplicationUser User { get; set; } = null!;
    public virtual Category Category { get; set; } = null!;
}