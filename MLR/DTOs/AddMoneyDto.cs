using System.ComponentModel.DataAnnotations;

namespace MLR.DTOs;

public class AddMoneyDto
{
    [Range(0.01, 1000000000, ErrorMessage = "Amount must be greater than 0")]
    public decimal Amount { get; set; }

 
    public string Source { get; set; } = "Salary";
}