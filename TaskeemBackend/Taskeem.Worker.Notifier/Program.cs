using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting.WindowsServices;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using Serilog;
using Serilog.Filters;
using Taskeem.Domain.EF.Context;
using Taskeem.Worker.Notifier;
using Taskeem.Worker.Notifier.Options;
using Taskeem.Worker.Notifier.Rabbit;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

var builder = Host.CreateDefaultBuilder(args);

if(WindowsServiceHelpers.IsWindowsService())
{
    builder.UseWindowsService();
}

builder.ConfigureServices((context,services) =>
    {
        var connectionString =
            context.Configuration.GetConnectionString("DefaultConnection");

        services.Configure<NotifierWorkerOptions>(context.Configuration.GetSection("NotifierOptions"));
        services.Configure<RabbitMqOptions>(context.Configuration.GetSection("RabbitMq"));

        services.AddSingleton<RabbitConnectionFactory>();
        services.AddSingleton<TaskNotifierConsumer>();
        services.AddSingleton<TaskNotifierPublisher>();

        services.AddHostedService<Worker>();

        services.AddTaskeemDomainEF(connectionString, useFactory: true);
    });

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.Logger(lc => lc
        .Filter.ByIncludingOnly(
            Matching.FromSource("OverdueTasks")
        )
        .WriteTo.File(
            path: "logs/overdue-tasks.log",
            rollingInterval: RollingInterval.Day
        )
    ).CreateLogger();

builder.Build().Run();
