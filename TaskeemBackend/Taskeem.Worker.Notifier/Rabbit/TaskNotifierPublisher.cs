using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Text;

namespace Taskeem.Worker.Notifier.Rabbit
{
    public class TaskNotifierPublisher
    {
        private readonly RabbitConnectionFactory _connectionFactory;

        public TaskNotifierPublisher(RabbitConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public async Task Publish(string message)
        {
            var connection = await _connectionFactory.GetConnectionAsync();
            var channel = await connection.CreateChannelAsync();
            await channel.QueueDeclareAsync(
                queue: "task_notifier_queue",
                durable: true,
                exclusive: false,
                autoDelete: false
            );

            var body = Encoding.UTF8.GetBytes(message);
            await channel.BasicPublishAsync(
                exchange: "",
                routingKey: "task_notifier_queue",
                mandatory: true,
                basicProperties: new BasicProperties(),
                body: body
            );
        }
    }
}
