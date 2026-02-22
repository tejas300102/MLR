using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MLR.DTOs;
using MLR.Services;

namespace MLR.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "USER")]
public class WalletController : ControllerBase
{
    private readonly IWalletService _walletService;

    public WalletController(IWalletService walletService)
    {
        _walletService = walletService;
    }

    [HttpGet("balance")]
    public async Task<IActionResult> GetBalance()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        var balance = await _walletService.GetBalanceAsync(userId);
        return Ok(balance);
    }

    [HttpPost("add-money")]
    public async Task<IActionResult> AddMoney([FromBody] AddMoneyDto addMoneyDto)
    {
        if (addMoneyDto.Amount <= 0)
            return BadRequest("Amount must be positive");

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        var result = await _walletService.AddMoneyAsync(userId, addMoneyDto);
        return Ok(result);
    }

    [HttpPost("pay")]
    public async Task<IActionResult> Pay([FromBody] PaymentDto paymentDto)
    {
        if (paymentDto.Amount <= 0)
            return BadRequest("Amount must be positive");

        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            var result = await _walletService.PayAsync(userId, paymentDto);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("transactions")]
    public async Task<IActionResult> GetTransactions([FromQuery] int limit = 10)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        var transactions = await _walletService.GetRecentTransactionsAsync(userId, limit);
        return Ok(transactions);
    }
}