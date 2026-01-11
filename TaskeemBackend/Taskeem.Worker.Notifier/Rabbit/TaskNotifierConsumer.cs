using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Text;

namespace Taskeem.Worker.Notifier.Rabbit
{
    public class TaskNotifierConsumer
    {
        private readonly IConnection _connection;

        public event Func<string, Task>? OnMessageReceived;

        public TaskNotifierConsumer(IConnection connection)
        {
            _connection = connection;
        }

        public async Task Start()
        {
            using var channel = await _connection.CreateChannelAsync();
            await channel.QueueDeclareAsync(
                queue: "task_notifier_queue",
                durable: true,
                exclusive: false,
                autoDelete: false
            );

            var consumer = new AsyncEventingBasicConsumer(channel);
            consumer.ReceivedAsync += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);

                if (OnMessageReceived != null)
                    await OnMessageReceived.Invoke(message);

                // Acknowledge
                await channel.BasicAckAsync(ea.DeliveryTag, false);
            };

            await channel.BasicConsumeAsync(
                queue: "task_notifier_queue",
                autoAck: false,
                consumer: consumer
            );
        }
    }
}
