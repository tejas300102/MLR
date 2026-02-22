using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MLR.DAO;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Wallet> Wallets { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<LeakageAlert> LeakageAlerts { get; set; }
    public DbSet<RuleExecutionLog> RuleExecutionLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Wallet>()
            .HasOne(w => w.User)
            .WithOne(u => u.Wallet)
            .HasForeignKey<Wallet>(w => w.UserId);

        builder.Entity<Transaction>()
            .HasOne(t => t.User)
            .WithMany(u => u.Transactions)
            .HasForeignKey(t => t.UserId);

        builder.Entity<Transaction>()
            .HasOne(t => t.Category)
            .WithMany(c => c.Transactions)
            .HasForeignKey(t => t.CategoryId);

        builder.Entity<LeakageAlert>()
            .HasOne(l => l.User)
            .WithMany()
            .HasForeignKey(l => l.UserId);

        builder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Food & Dining", Description = "Restaurants, groceries, food delivery" },
            new Category { Id = 2, Name = "Transportation", Description = "Fuel, public transport, taxi, auto" },
            new Category { Id = 3, Name = "Shopping", Description = "Clothing, electronics, online shopping" },
            new Category { Id = 4, Name = "Entertainment", Description = "Movies, games, subscriptions" },
            new Category { Id = 5, Name = "Bills & Utilities", Description = "Electricity, water, internet, phone" },
            new Category { Id = 6, Name = "Healthcare", Description = "Medical expenses, pharmacy, insurance" },
            new Category { Id = 7, Name = "Education", Description = "Fees, books, courses, training" },
            new Category { Id = 8, Name = "Other", Description = "Miscellaneous expenses" }
        );
    }
}