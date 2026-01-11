using System;
using System.Collections.Generic;
using System.Text;

namespace Taskeem.Worker.Notifier.Options
{
    public class RabbitMqOptions
    {
        public string Host { get; set; } = null!;
        public int Port { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Exchange { get; set; } = null!;
        public string Queue { get; set; } = null!;
        public string RoutingKey { get; set; } = null!;
    }
}
