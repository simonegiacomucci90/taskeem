using Microsoft.EntityFrameworkCore;
using Taskeem.Domain.EF.Context;
using TaskeemData.Domain.Entities;
using TaskeemData.Domain.Interfaces;

namespace Taskeem.Domain.EF
{
    public class UserRepository : IUserRepository
    {
        private readonly TaskeemDbContext _dbContext;
        public UserRepository(TaskeemDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<User> GetUserById(Guid id)
        {
            var user = await _dbContext
                .Users
                .Include(u => u.Tasks)
                .FirstOrDefaultAsync(ut => ut.Id == id);

            return user;
        }
    }
}
