using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Text;
using Taskeem.Worker.Notifier.Options;

namespace Taskeem.Worker.Notifier.Rabbit
{
    public class RabbitConnectionFactory
    {
        private readonly ConnectionFactory _factory;
        private IConnection? _connection;

        public RabbitConnectionFactory(IOptions<RabbitMqOptions> options)
        {
            var rabbitOptions = options.Value;
            _factory = new ConnectionFactory
            {
                HostName = rabbitOptions.Host,
                Port = rabbitOptions.Port,
                UserName = rabbitOptions.Username,
                Password = rabbitOptions.Password,
            };
        }

        public async Task<IConnection> GetConnectionAsync()
        {
            if (_connection == null || !_connection.IsOpen)
            {
                _connection = await _factory.CreateConnectionAsync();
            }
            return _connection;
        }
    }
}
