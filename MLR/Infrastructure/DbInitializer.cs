using Microsoft.AspNetCore.Identity;
using MLR.DAO;

namespace MLR.Infrastructure;

public static class DbInitializer
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        // Roles
        await EnsureRoleAsync(roleManager, "ADMIN");
        await EnsureRoleAsync(roleManager, "USER");

        // Default Admin
        const string adminEmail = "admin@upi.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                FirstName = "Admin",
                LastName = "User",
                EmailConfirmed = true,
                IsActive = true
            };

            var createResult = await userManager.CreateAsync(adminUser, "Admin@123");
            if (createResult.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "ADMIN");

                if (!context.Wallets.Any(w => w.UserId == adminUser.Id))
                {
                    context.Wallets.Add(new Wallet { UserId = adminUser.Id, Balance = 0 });
                    await context.SaveChangesAsync();
                }
            }
        }
        else
        {
   
            if (!await userManager.IsInRoleAsync(adminUser, "ADMIN"))
                await userManager.AddToRoleAsync(adminUser, "ADMIN");
        }

        // Categories
        var categoriesToEnsure = new[]
        {
            new Category { Name = "Food & Dining", Description = "Restaurants, groceries, food delivery" },
            new Category { Name = "Transportation", Description = "Fuel, public transport, taxi, auto" },
            new Category { Name = "Shopping", Description = "Clothing, electronics, online shopping" },
            new Category { Name = "Entertainment", Description = "Movies, games, subscriptions" },
            new Category { Name = "Bills & Utilities", Description = "Electricity, water, internet, phone" },
            new Category { Name = "Healthcare", Description = "Medical expenses, pharmacy, insurance" },
            new Category { Name = "Education", Description = "Fees, books, courses, training" },
            new Category { Name = "Other", Description = "Miscellaneous expenses" }
        };

        foreach (var cat in categoriesToEnsure)
        {
            if (!context.Categories.Any(c => c.Name == cat.Name))
            {
                context.Categories.Add(cat);
            }
        }

        await context.SaveChangesAsync();
    }

    private static async Task EnsureRoleAsync(RoleManager<IdentityRole> roleManager, string roleName)
    {
        if (!await roleManager.RoleExistsAsync(roleName))
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }
}