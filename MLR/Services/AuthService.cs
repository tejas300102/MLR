using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MLR.DAO;
using MLR.DTOs;

namespace MLR.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;
    private readonly IWalletDao _walletDao;

    public AuthService(UserManager<ApplicationUser> userManager, IConfiguration configuration, IWalletDao walletDao)
    {
        _userManager = userManager;
        _configuration = configuration;
        _walletDao = walletDao;
    }

    public async Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto)
    {
        var user = new ApplicationUser
        {
            UserName = registerDto.Email,
            Email = registerDto.Email,
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded) return null;

        await _userManager.AddToRoleAsync(user, "USER");
        await _walletDao.CreateAsync(new Wallet { UserId = user.Id });

        var token = GenerateJwtToken(user, "USER");
        return new AuthResponseDto { Token = token, Email = user.Email!, Role = "USER" };
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        if (!user.IsActive)
        {
            throw new UnauthorizedAccessException("Your account has been blocked by the admin");
        }

        var isValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
        if (!isValid)
        {
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        var roles = await _userManager.GetRolesAsync(user);
        var role = roles.FirstOrDefault()?.ToUpper() ?? "USER";

        var token = GenerateJwtToken(user, role);
        return new AuthResponseDto { Token = token, Email = user.Email!, Role = role };
    }

    private string GenerateJwtToken(ApplicationUser user, string role)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email!),
            new Claim(ClaimTypes.Role, role)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<object> GetProfileAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return null;

        return new
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            CreatedAt = user.CreatedAt
        };
    }
}