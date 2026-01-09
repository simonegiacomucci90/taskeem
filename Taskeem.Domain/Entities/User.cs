using System;
using System.Collections.Generic;
using System.Text;

namespace TaskeemData.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }

        //Relationships
        public IEnumerable<UserTask> Tasks { get; set; }
    }
}
