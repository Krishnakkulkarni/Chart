using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace WebApi.Models
{
    public class AutenticationContext : IdentityDbContext
    {
        public AutenticationContext(DbContextOptions options):base(options)
        {
        }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        
        public DbSet<Analysts> Analysts { get; set; }

        public DbSet<Managers> Managers { get; set; }

        public DbSet<Operations> Operations { get; set; }

        public DbSet<Sales> Sales { get; set; }

        public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken))
        {
            var addedEntities = ChangeTracker.Entries().Where(e => e.State == EntityState.Added).ToList();

            addedEntities.ForEach(E =>
            {
                E.Property("CreatedOn").CurrentValue = DateTime.Now;
            });

            var editedEntities = ChangeTracker.Entries().Where(E => E.State == EntityState.Modified).ToList();

            editedEntities.ForEach(e =>
            {
                e.Property("ModifiedOn").CurrentValue = DateTime.Now;
            });

            return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
        }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    //optionsBuilder.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
        //    optionsBuilder.UseSqlServer("Data Source=VF-034;Initial Catalog=AccountDatabase; Trusted_Connection=True;MultipleActiveResultSets=true;");
        //}
    }
}