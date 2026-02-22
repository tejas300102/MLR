using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MLR.Migrations
{
    /// <inheritdoc />
    public partial class AddUpiIdColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UpiId",
                table: "Transactions",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UpiId",
                table: "Transactions");
        }
    }
}
