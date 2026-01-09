using AutoBogus;
using Taskeem.Domain.EF.Tests.Helpers;
using TaskeemData.Domain.Entities;

namespace Taskeem.Domain.EF.Tests
{
    public class UserRepositoryTests
    {
        [Fact]
        public async Task GetUserById_Success()
        {
            //Arrange
            var context = TestDatabaseFactory.Create();
            var repo = new UserRepository(context);

            var user = new AutoFaker<User>()
                .RuleFor(u => u.FirstName, f => f.Person.FirstName)
                .RuleFor(u => u.LastName, f => f.Person.LastName)
                .RuleFor(u => u.Email, f => f.Person.Email)
                .RuleFor(u => u.PhoneNumber, f => f.Phone.PhoneNumber())
                .RuleFor(u => u.Tasks, Enumerable.Range(0, 3).Select(_ => new AutoFaker<UserTask>()
                    .RuleFor(ut => ut.Title, f => f.Lorem.Sentence())
                    .Generate()).ToList())
                .Generate();

            context.Users.Add(user);
            await context.SaveChangesAsync();

            //Act
            var dbUser = await repo.GetUserById(user.Id);

            //Assert
            Assert.NotNull(dbUser);
            Assert.Equal(user.FirstName, dbUser.FirstName);
        }
    }
}
