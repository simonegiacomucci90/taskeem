using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Taskeem.Domain.EF;
using Taskeem.Domain.EF.Context;
using TaskeemData.Domain.Interfaces;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class TaskeemDomainEFDependencyInjectionExtension
    {
        public static IServiceCollection AddTaskeemDomainEF(this IServiceCollection services, string connectionString)
        {
            services.AddDbContext<TaskeemDbContext>(options =>
                options.UseSqlServer(connectionString));

            services.AddScoped<IUserTaskRepository, UserTaskRepository>();
            services.AddScoped<IUserRepository, UserRepository>();

            return services;
        }
    }
}
