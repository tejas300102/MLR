using System.ComponentModel.DataAnnotations;

namespace MLR.DAO;

public class LeakageAlert
{
    [Key]
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public string RuleName { get; set; } = string.Empty;

    public string Message { get; set; } = string.Empty;

   
    public int Severity { get; set; } = 0;

    public decimal? Amount { get; set; }

    public bool IsRead { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual ApplicationUser User { get; set; } = null!;
}
