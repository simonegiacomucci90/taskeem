using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Taskeem.Domain.EF.Migrations
{
    /// <inheritdoc />
    public partial class AddNotificationSentAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "NotificationSentAt",
                table: "UserTasks",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NotificationSentAt",
                table: "UserTasks");
        }
    }
}
