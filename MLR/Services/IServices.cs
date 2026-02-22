using MLR.DTOs;
using MLR.DAO;

namespace MLR.Services;

public interface IAuthService
{
    Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
    Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    Task<object> GetProfileAsync(string userId);
}

public interface IWalletService
{
    Task<WalletBalanceDto> GetBalanceAsync(string userId);
    Task<WalletBalanceDto> AddMoneyAsync(string userId, AddMoneyDto addMoneyDto);
    Task<WalletBalanceDto> PayAsync(string userId, PaymentDto paymentDto);
    Task<List<TransactionDto>> GetRecentTransactionsAsync(string userId, int limit);
}

public interface ITransactionService
{
    Task<List<TransactionDto>> GetTransactionHistoryAsync(string userId);
    Task<TransactionDto?> GetTransactionDetailsAsync(string userId, int transactionId);
}

public interface IAnalyticsService
{
    Task<object> GetSpendingAnalyticsAsync(string userId);
    Task<List<LeakageAlertDto>> GetLeakageAlertsAsync(string userId);
    Task<object> GetLeakageAnalyticsAsync(string userId);
   
    Task<bool> MarkAlertAsReadAsync(string userId, int alertId);
}

public interface IAdminService
{
    Task<List<ApplicationUser>> GetAllUsersAsync(string? search = null);
    Task<bool> BlockUserAsync(string userId);
    Task<bool> UnblockUserAsync(string userId);
    Task<bool> ResetWalletAsync(string userId);
    Task<object> GetSystemAnalyticsAsync();
    Task<List<Category>> GetCategoriesAsync();
    Task<object> GetRulesStatusAsync();
}