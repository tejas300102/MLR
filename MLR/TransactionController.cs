using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MLR.Services;

namespace MLR.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "USER")]
public class TransactionController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        var transactions = await _transactionService.GetTransactionHistoryAsync(userId);
        return Ok(transactions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDetails(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        var transaction = await _transactionService.GetTransactionDetailsAsync(userId, id);
        
        if (transaction == null)
            return NotFound("Transaction not found");

        return Ok(transaction);
    }
}