using System.ComponentModel.DataAnnotations;

namespace MLR.DAO;

public class Category
{
    [Key]
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
