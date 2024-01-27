using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Cereem.WebApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddEnrollment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EnrollmentId",
                table: "Contacts",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Enrollments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EnrollmentId = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    State = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Enrollments", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Contacts_EnrollmentId",
                table: "Contacts",
                column: "EnrollmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Contacts_Enrollments_EnrollmentId",
                table: "Contacts",
                column: "EnrollmentId",
                principalTable: "Enrollments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contacts_Enrollments_EnrollmentId",
                table: "Contacts");

            migrationBuilder.DropTable(
                name: "Enrollments");

            migrationBuilder.DropIndex(
                name: "IX_Contacts_EnrollmentId",
                table: "Contacts");

            migrationBuilder.DropColumn(
                name: "EnrollmentId",
                table: "Contacts");
        }
    }
}
