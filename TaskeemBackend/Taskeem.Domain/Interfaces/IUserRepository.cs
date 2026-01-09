using System;
using System.Collections.Generic;
using System.Text;
using TaskeemData.Domain.Entities;

namespace TaskeemData.Domain.Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetUserById(Guid id);
    }
}
