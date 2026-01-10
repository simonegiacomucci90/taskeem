using Microsoft.AspNetCore.Mvc;
using Taskeem.Api.DTOs;
using TaskeemData.Domain.Entities;
using TaskeemData.Domain.Interfaces;

namespace Taskeem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserTasksController : ControllerBase
    {
        private readonly IUserTaskRepository _userTaskRepository;
        public UserTasksController(IUserTaskRepository userTaskRepository)
        {
            _userTaskRepository = userTaskRepository;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserTaskDto taskDto)
        {
            var task = new UserTask
            {
                Description = taskDto.Description,
                DueDate = taskDto.DueDate,
                Priority = taskDto.Priority,
                Title = taskDto.Title,
                IdAssignee = taskDto.IdAssignee,
            };
            var taskId = await _userTaskRepository.CreateTask(task);

            return Ok(taskId);

        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UserTaskDto taskDto)
        {
            var task = new UserTask
            {
                Id = taskDto.Id,
                Description = taskDto.Description,
                DueDate = taskDto.DueDate,
                Priority = taskDto.Priority,
                Title = taskDto.Title,
                IdAssignee = taskDto.IdAssignee,
            };
            await _userTaskRepository.UpdateTask(task);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _userTaskRepository.DeleteTaskById(Guid.Parse(id));
            return Ok();
        }
    }
}
