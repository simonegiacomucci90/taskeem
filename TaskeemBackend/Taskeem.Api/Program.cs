using Taskeem.Api.Options;
using Taskeem.Domain.EF.Context;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.Configure<CorsOptions>(
    builder.Configuration.GetSection("Cors")
);

var corsOptions = builder.Configuration
    .GetSection("Cors")
    .Get<CorsOptions>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("DynamicCors", (policy) =>
    {
        if (corsOptions?.AllowedOrigins?.Length > 0)
        {
            policy
                .WithOrigins(corsOptions.AllowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    });
});

builder.Services.AddControllers();

builder.Services.AddTaskeemDomainEF(connectionString);

builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<TaskeemDbContext>();
    dbContext.Database.Migrate();
}

// Swagger solo in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("DynamicCors");
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
