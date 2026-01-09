using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using TaskeemData.Domain.Entities;

namespace Taskeem.Domain.EF.Context
{
    public class TaskeemDbContext : DbContext
    {
        public TaskeemDbContext(DbContextOptions<TaskeemDbContext> options) : base(options)
        {}

        public DbSet<UserTask> UserTasks => Set<UserTask>();
        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u  => u.Id);

                entity.Property(u => u.FirstName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(u => u.LastName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(u => u.PhoneNumber)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasMany(u => u.Tasks)
                    .WithOne(ut => ut.Assignee)
                    .HasForeignKey(ut => ut.IdAssignee)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<UserTask>(entity =>
            {
                entity.HasKey(ut => ut.Id);

                entity.Property(ut => ut.Title)
                    .IsRequired()
                    .HasMaxLength(500);
            });
        }
    }
}
