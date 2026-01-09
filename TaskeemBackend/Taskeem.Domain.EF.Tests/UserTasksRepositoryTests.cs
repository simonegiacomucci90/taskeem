using AutoBogus;
using Microsoft.EntityFrameworkCore;
using Taskeem.Domain.EF.Tests.Helpers;
using TaskeemData.Domain.Entities;

namespace Taskeem.Domain.EF.Tests
{
    public class UserTasksRepositoryTests
    {
        [Fact]
        public async Task GetTaskById_Success()
        {
            //Arrange
            var context = TestDatabaseFactory.Create();
            var repo = new UserTaskRepository(context);

            var task = new AutoFaker<UserTask>()
                    .RuleFor(ut => ut.Title, f => f.Lorem.Sentence())
                    .RuleFor(ut => ut.IdAssignee, f => null)
                    .RuleFor(ut => ut.Assignee, f => null)
                    .Generate();

            context.UserTasks.Add(task);
            await context.SaveChangesAsync();

            //Act
            var dbTask = await repo.GetTaskById(task.Id);

            //Assert
            Assert.NotNull(dbTask);
            Assert.Equal(task.Title, dbTask.Title);
        }

        [Fact]
        public async Task CreateTask_Success()
        {
            //Arrange
            var context = TestDatabaseFactory.Create();
            var repo = new UserTaskRepository(context);

            var task = new AutoFaker<UserTask>()
                    .RuleFor(ut => ut.Title, f => f.Lorem.Sentence())
                    .RuleFor(ut => ut.IdAssignee, f => null)
                    .RuleFor(ut => ut.Assignee, f => null)
                    .Generate();

            //Act
            var taskId = await repo.CreateTask(task);

            //Assert
            Assert.Equal(task.Id, taskId);

            var dbTask = await context.UserTasks.FirstOrDefaultAsync(ut => ut.Id == taskId);
            Assert.NotNull(dbTask);
            Assert.Equal(task.Id, dbTask.Id);
        }

        [Fact]
        public async Task UpdateTask_Success()
        {
            //Arrange
            var context = TestDatabaseFactory.Create();
            var repo = new UserTaskRepository(context);

            var task = new AutoFaker<UserTask>()
                    .RuleFor(ut => ut.Title, f => f.Lorem.Sentence())
                    .RuleFor(ut => ut.IdAssignee, f => null)
                    .RuleFor(ut => ut.Assignee, f => null)
                    .Generate();

            context.UserTasks.Add(task);
            await context.SaveChangesAsync();

            //Act
            task.Title = "Updated title";
            await repo.UpdateTask(task);

            //Assert
            var dbTask = await context.UserTasks.FirstOrDefaultAsync(ut => ut.Id == task.Id);
            Assert.NotNull(dbTask);
            Assert.Equal("Updated title", dbTask.Title);
        }

        [Fact]
        public async Task DeleteTaskById_Success()
        {
            //Arrange
            var context = TestDatabaseFactory.Create();
            var repo = new UserTaskRepository(context);

            var task = new AutoFaker<UserTask>()
                    .RuleFor(ut => ut.Title, f => f.Lorem.Sentence())
                    .RuleFor(ut => ut.IdAssignee, f => null)
                    .RuleFor(ut => ut.Assignee, f => null)
                    .Generate();

            context.UserTasks.Add(task);
            await context.SaveChangesAsync();

            //Act
            await repo.DeleteTaskById(task.Id);

            //Assert
            var dbTask = await context.UserTasks.FirstOrDefaultAsync(ut => ut.Id == task.Id);
            Assert.Null(dbTask);
        }
    }
}
