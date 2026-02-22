namespace MLR.DAO;

public interface ICategoryDao
{
    Task<List<Category>> GetAllAsync();
    Task<Category?> GetByIdAsync(int id);
}
