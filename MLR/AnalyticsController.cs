using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MLR.Services;

namespace MLR.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "USER")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;

    public AnalyticsController(IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    [HttpGet("spending")]
    public async Task<IActionResult> GetSpendingAnalytics()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        var analytics = await _analyticsService.GetSpendingAnalyticsAsync(userId);
        return Ok(analytics);
    }

    [HttpGet("leakage-alerts")]
    public async Task<IActionResult> GetLeakageAlerts()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        var alerts = await _analyticsService.GetLeakageAlertsAsync(userId);
        return Ok(alerts);
    }

    // New Endpoint to Mark Alert as Read
    [HttpPost("leakage-alerts/{id}/read")]
    public async Task<IActionResult> MarkAlertAsRead(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        var result = await _analyticsService.MarkAlertAsReadAsync(userId, id);

        if (!result)
        {
            return NotFound(new { message = "Alert not found or access denied" });
        }

        return Ok(new { success = true, message = "Alert marked as read" });
    }

    [HttpGet("leakage")]
    public async Task<IActionResult> GetLeakageAnalytics()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        var analytics = await _analyticsService.GetLeakageAnalyticsAsync(userId);
        return Ok(analytics);
    }
}