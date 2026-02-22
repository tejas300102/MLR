namespace MLR.DAO;

public interface IRuleExecutionLogDao
{
    Task<RuleExecutionLog> CreateAsync(RuleExecutionLog log);
    Task<List<RuleExecutionLog>> GetRecentLogsAsync(int count);
}
