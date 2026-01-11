namespace TaskeemData.Domain.Entities
{
    public class UserTask
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public int Priority { get; set; }
        public DateTime? NotificationSentAt { get; set; }

        //Relationships
        public Guid? IdAssignee { get; set; }
        public User Assignee { get; set; }
    }
}
