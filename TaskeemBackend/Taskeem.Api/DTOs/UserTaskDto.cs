using TaskeemData.Domain.Entities;

namespace Taskeem.Api.DTOs
{
    public class UserTaskDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public int Priority { get; set; }

        //Relationships
        public Guid? IdAssignee { get; set; }
        public UserDto Assignee { get; set; }
    }
}
