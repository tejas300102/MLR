namespace MLR.DTOs;

public class LeakageAlertDto
{
    public int Id { get; set; }
    public string RuleName { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Severity { get; set; } = string.Empty;
    public bool IsRead { get; set; } // Added property
    public DateTime CreatedAt { get; set; }
}