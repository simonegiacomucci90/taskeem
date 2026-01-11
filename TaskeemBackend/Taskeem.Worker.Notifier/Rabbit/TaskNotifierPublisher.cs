using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Text;

namespace Taskeem.Worker.Notifier.Rabbit
{
    public class TaskNotifierPublisher
    {
        private readonly IConnection _connection;

        public TaskNotifierPublisher(IConnection connection)
        {
            _connection = connection;
        }

        public async Task Publish(string message)
        {
            using var channel = await _connection.CreateChannelAsync();
            await channel.QueueDeclareAsync(
                queue: "task_reminder_queue",
                durable: true,
                exclusive: false,
                autoDelete: false
            );

            var body = Encoding.UTF8.GetBytes(message);
            await channel.BasicPublishAsync(
                exchange: "",
                routingKey: "task_reminder_queue",
                mandatory: true,
                basicProperties: new BasicProperties(),
                body: body
            );
        }
    }
}
