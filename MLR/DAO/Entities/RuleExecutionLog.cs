using System.ComponentModel.DataAnnotations;

namespace MLR.DAO;

public class RuleExecutionLog
{
    [Key]
    public int Id { get; set; }

    public DateTime ExecutedAt { get; set; } = DateTime.UtcNow;

    public int UsersProcessed { get; set; }

    public int AlertsGenerated { get; set; }

    public TimeSpan ExecutionTime { get; set; }
}
