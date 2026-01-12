using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Serilog;
using System.Net.WebSockets;
using Taskeem.Domain.EF.Context;
using Taskeem.Worker.Notifier.Dtos;
using Taskeem.Worker.Notifier.Options;
using Taskeem.Worker.Notifier.Rabbit;

namespace Taskeem.Worker.Notifier
{
    public class Worker(
        IDbContextFactory<TaskeemDbContext> _dbContextFactory,
        ILogger<Worker> _logger,
        IOptions<NotifierWorkerOptions> _options,
        TaskNotifierPublisher _publisher,
        TaskNotifierConsumer _consumer
        ) : BackgroundService
    {
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var overdueLogger = Log.ForContext("SourceContext", "OverdueTasks");
            _consumer.OnMessageReceived += async msg =>
            {
                var taskNotification = JsonConvert.DeserializeObject<UserTaskNotification>(msg);
                overdueLogger.Information($"Hi your Task is due {{Task {taskNotification?.TaskTitle}}}");
                await Task.CompletedTask;
            };

            // Retry connection to RabbitMQ
            const int maxRetries = 10;
            int retryCount = 0;
            bool connected = false;

            while (!connected && retryCount < maxRetries && !stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation($"Attempting to connect to RabbitMQ (attempt {retryCount + 1}/{maxRetries})...");
                    await _consumer.Start();
                    connected = true;
                    _logger.LogInformation("Successfully connected to RabbitMQ");
                }
                catch (Exception ex)
                {
                    retryCount++;
                    _logger.LogWarning(ex, $"Failed to connect to RabbitMQ (attempt {retryCount}/{maxRetries}). Retrying in 5 seconds...");

                    if (retryCount < maxRetries)
                    {
                        await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
                    }
                }
            }

            if (!connected)
            {
                _logger.LogError("Failed to connect to RabbitMQ after {MaxRetries} attempts. Worker will continue without message consumer.", maxRetries);
            }
            var _dbContext = await _dbContextFactory.CreateDbContextAsync();

            _logger.LogInformation("Starting notifier service!");
            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Retrieving overdue tasks...");
                var date = DateTime.Now;
                var tasksOverdue = await _dbContext
                    .UserTasks
                    .Where(ut => ut.DueDate < date && ut.NotificationSentAt == null )
                    .ToListAsync();

                foreach (var task in tasksOverdue)
                {
                    var message = JsonConvert.SerializeObject(new UserTaskNotification() { UserTaskId = task.Id, TaskTitle = task.Title});
                    await _publisher.Publish(message);

                    task.NotificationSentAt = DateTime.Now;
                }

                await _dbContext.SaveChangesAsync();

                _logger.LogInformation($"Worker tick at: {DateTimeOffset.Now}, processed {tasksOverdue.Count()} tasks");

                await Task.Delay(TimeSpan.FromSeconds(_options?.Value?.NotifierDelaySeconds ?? 5), stoppingToken);
            }
        }
    }
}
