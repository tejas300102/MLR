using System.ComponentModel.DataAnnotations;

namespace MLR.DTOs;

public class LoginDto
{
    [RequiredRegex(ValidationPatterns.Email, ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    [RequiredRegex(ValidationPatterns.Password, ErrorMessage = "Password must be at least 6 characters and contain at least one digit")]
    public string Password { get; set; } = string.Empty;
}
