using System.ComponentModel.DataAnnotations;

namespace MLR.DTOs;

public class PaymentDto
{
    [Range(0.01, 1000000000, ErrorMessage = "Amount must be greater than 0")]
    public decimal Amount { get; set; }

    [RequiredRegex(ValidationPatterns.NonEmptyText500, ErrorMessage = "Description must be 1-500 characters")]
    public string Description { get; set; } = string.Empty;

    // Added UPI ID field
    public string? UpiId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "CategoryId must be a positive number")]
    public int CategoryId { get; set; }
}