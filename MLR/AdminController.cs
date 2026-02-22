using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MLR.Services;

namespace MLR.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "ADMIN")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers([FromQuery] string? search)
    {
        var users = await _adminService.GetAllUsersAsync(search);
        return Ok(users.Select(u => new
        {
            u.Id,
            u.Email,
            u.FirstName,
            u.LastName,
            IsBlocked = !u.IsActive,
            u.CreatedAt
        }));
    }

    [HttpPost("users/{userId}/block")]
    public async Task<IActionResult> BlockUser(string userId)
    {
        var result = await _adminService.BlockUserAsync(userId);
        if (!result)
            return NotFound("User not found");

        return Ok(new { Message = "User blocked successfully" });
    }

    [HttpPost("users/{userId}/unblock")]
    public async Task<IActionResult> UnblockUser(string userId)
    {
        var result = await _adminService.UnblockUserAsync(userId);
        if (!result)
            return NotFound("User not found");

        return Ok(new { Message = "User unblocked successfully" });
    }

    [HttpPost("users/{userId}/reset-wallet")]
    public async Task<IActionResult> ResetWallet(string userId)
    {
        var result = await _adminService.ResetWalletAsync(userId);
        if (!result)
            return NotFound("User wallet not found");

        return Ok(new { Message = "Wallet reset successfully" });
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetSystemAnalytics()
    {
        var analytics = await _adminService.GetSystemAnalyticsAsync();
        return Ok(analytics);
    }

    [HttpGet("categories")]
    [AllowAnonymous]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await _adminService.GetCategoriesAsync();
        return Ok(categories);
    }

    [HttpGet("rules/status")]
    public async Task<IActionResult> GetRulesStatus()
    {
        var rulesStatus = await _adminService.GetRulesStatusAsync();
        return Ok(rulesStatus);
    }
}