using Microsoft.EntityFrameworkCore;
using MLR.DAO;

namespace MLR.DAOImpl;

public class CategoryDao : ICategoryDao
{
    private readonly ApplicationDbContext _context;

    public CategoryDao(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Category>> GetAllAsync()
    {
        return await _context.Categories.ToListAsync();
    }

    public async Task<Category?> GetByIdAsync(int id)
    {
        return await _context.Categories.FindAsync(id);
    }
}
