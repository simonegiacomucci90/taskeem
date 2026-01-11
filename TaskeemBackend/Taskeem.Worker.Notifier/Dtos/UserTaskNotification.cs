using System;
using System.Collections.Generic;
using System.Text;

namespace Taskeem.Worker.Notifier.Dtos
{
    public class UserTaskNotification
    {
        public Guid UserTaskId { get; set; }
        public string TaskTitle { get; set; }
    }
}
