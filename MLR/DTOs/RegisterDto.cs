using System.ComponentModel.DataAnnotations;

namespace MLR.DTOs;

public class RegisterDto
{
    [RequiredRegex(ValidationPatterns.PersonName, ErrorMessage = "First name must be 1-50 letters (spaces allowed)")]
    public string FirstName { get; set; } = string.Empty;

    [RequiredRegex(ValidationPatterns.PersonName, ErrorMessage = "Last name must be 1-50 letters (spaces allowed)")]
    public string LastName { get; set; } = string.Empty;

    [RequiredRegex(ValidationPatterns.Email, ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    [RequiredRegex(ValidationPatterns.Password, ErrorMessage = "Password must be at least 6 characters and contain at least one digit")]
    public string Password { get; set; } = string.Empty;
}
