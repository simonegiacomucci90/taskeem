using Microsoft.EntityFrameworkCore;
using Taskeem.Domain.EF.Context;
using TaskeemData.Domain.Entities;
using TaskeemData.Domain.Interfaces;

namespace Taskeem.Domain.EF
{
    public class UserTaskRepository : IUserTaskRepository
    {
        private readonly TaskeemDbContext _dbContext;
        public UserTaskRepository(TaskeemDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Guid> CreateTask(UserTask task)
        {
            _dbContext.UserTasks.Add(task);
            await _dbContext.SaveChangesAsync();

            return task.Id;
        }

        public async Task UpdateTask(UserTask task)
        {
            _dbContext.UserTasks.Update(task);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteTaskById(Guid id)
        {
            var task = await _dbContext.UserTasks.FirstOrDefaultAsync(ut => ut.Id == id);
            if(task != null)
            {
                _dbContext.UserTasks.Remove(task);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<UserTask> GetTaskById(Guid id)
        {
            var task = await _dbContext.UserTasks
                .Include(ut => ut.Assignee)
                .FirstOrDefaultAsync(ut => ut.Id == id);

            return task;
        }
    }
}
