using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Taskeem.Domain.EF.Context;

namespace Taskeem.Domain.EF.Tests.Helpers
{
    public class TestDatabaseFactory
    {
        public static TaskeemDbContext Create()
        {
            var connection = new SqliteConnection("Filename=:memory:");
            connection.Open();

            var options = new DbContextOptionsBuilder<TaskeemDbContext>()
                .UseSqlite(connection)
                .Options;

            var context = new TaskeemDbContext(options);
            context.Database.EnsureCreated();

            return context;
        }
    }
}
