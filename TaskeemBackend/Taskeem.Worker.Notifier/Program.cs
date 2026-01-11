using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using Taskeem.Worker.Notifier;
using Taskeem.Worker.Notifier.Options;
using Taskeem.Worker.Notifier.Rabbit;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

var builder = Host.CreateDefaultBuilder(args)
    .UseWindowsService()
    .ConfigureServices(async (context,services) =>
    {
        var connectionString =
            context.Configuration.GetConnectionString("DefaultConnection");

        //RabbitMq
        var rabbitOptions = context.Configuration
                .GetSection("RabbitMq")
                .Get<RabbitMqOptions>();

        var factory = new ConnectionFactory
        {
            HostName = rabbitOptions?.Host,
            Port = rabbitOptions?.Port ?? 0,
            UserName = rabbitOptions?.Username,
            Password = rabbitOptions?.Password,
        };

        var rabbitConnection = await factory.CreateConnectionAsync();
        services.AddSingleton(rabbitConnection);

        services.Configure<NotifierWorkerOptions>(context.Configuration.GetSection("NotifierOptions"));

        services.AddSingleton<TaskNotifierConsumer>();

        services.AddHostedService<Worker>();

        services.AddTaskeemDomainEF(connectionString);
    })
    .Build();

builder.Run();
