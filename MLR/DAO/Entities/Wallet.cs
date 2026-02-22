using System.ComponentModel.DataAnnotations;

namespace MLR.DAO;

public class Wallet
{
    [Key]
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public decimal Balance { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual ApplicationUser User { get; set; } = null!;
}
