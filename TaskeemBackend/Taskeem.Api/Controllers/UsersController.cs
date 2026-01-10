using Microsoft.AspNetCore.Mvc;
using Taskeem.Api.DTOs;
using TaskeemData.Domain.Entities;
using TaskeemData.Domain.Interfaces;

namespace Taskeem.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var user = await _userRepository.GetUserById(Guid.Parse(id));

            if (user == null)
            {
                return NotFound();
            }
            else
            {
                var userDto = new UserDto
                {
                    Email = user.Email,
                    FirstName = user.FirstName,
                    Id = user.Id,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    Tasks = user.Tasks.Select(ut => new UserTaskDto
                    {
                        Id = ut.Id,
                        Description = ut.Description,
                        DueDate = ut.DueDate,
                        Priority = ut.Priority,
                        Title = ut.Title
                    })
                };

                return Ok(userDto);

            }
        }
    }
}
