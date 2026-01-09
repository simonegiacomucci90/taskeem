using System;
using System.Collections.Generic;
using System.Text;
using TaskeemData.Domain.Entities;

namespace TaskeemData.Domain.Interfaces
{
    public interface IUserTaskRepository
    {
        Task<Guid> CreateTask(UserTask task);
        Task UpdateTask(UserTask task);
        Task DeleteTaskById(Guid id);
        Task<UserTask> GetTaskById(Guid id);
    }
}
