using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Net.WebSockets;
using Taskeem.Domain.EF.Context;
using Taskeem.Worker.Notifier.Dtos;
using Taskeem.Worker.Notifier.Options;
using Taskeem.Worker.Notifier.Rabbit;

namespace Taskeem.Worker.Notifier
{
    public class Worker(TaskeemDbContext _dbContext, ILogger<Worker> _logger, IOptions<NotifierWorkerOptions> _options, TaskNotifierPublisher _publisher, TaskNotifierConsumer _consumer) : BackgroundService
    {
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await _consumer.Start();
            _consumer.OnMessageReceived += async msg =>
            {
                var taskNotification = JsonConvert.DeserializeObject<UserTaskNotification>(msg);
                _logger.LogInformation($"Hi your Task is due {{Task {taskNotification?.TaskTitle}}}");
                await Task.CompletedTask;
            };

            while (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogInformation("Starting notifier service!");
                _logger.LogInformation("Retrieving overdue tasks...");
                var date = DateTime.Now;
                var tasksOverdue = _dbContext
                    .UserTasks
                    .Where(ut => ut.DueDate < date && ut.NotificationSentAt != null );

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
