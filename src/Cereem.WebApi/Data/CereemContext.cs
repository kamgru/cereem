using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cereem.WebApi.Data;

public class Contact
{
    public int Id { get; set; }
    public required string ContactId { get; set; }
    public required string Name { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public Company? Company { get; set; }
    
    public class TypeConfig : IEntityTypeConfiguration<Contact>
    {
        public void Configure(EntityTypeBuilder<Contact> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(c => c.ContactId).IsRequired();
            builder.Property(c => c.Name).IsRequired();
        }
    }
}

public class Company
{
    public int Id { get; set; }
    public required string CompanyId { get; set; }
    public required string Name { get; set; }
    public required string CustomName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public required ICollection<Contact> Contacts { get; set; } = [];
    
    public class TypeConfig : IEntityTypeConfiguration<Company>
    {
        public void Configure(EntityTypeBuilder<Company> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(c => c.CompanyId).IsRequired();
            builder.Property(c => c.Name).IsRequired();
            builder.Property(c => c.CustomName).IsRequired();
            builder.HasMany(c => c.Contacts).WithOne();
        }
    }
}

public enum EnrollmentState
{
    Open = 0,
    Closed = 1,
    Cancelled = 2
}

public class Enrollment
{
    public int Id { get; set; }
    public required string EnrollmentId { get; set; }
    public required string Name { get; set; }
    public EnrollmentState State { get; set; }
    public required ICollection<Contact> Contacts { get; set; } = [];
    
    public class TypeConfig : IEntityTypeConfiguration<Enrollment>
    {
        public void Configure(EntityTypeBuilder<Enrollment> builder)
        {
            builder.HasKey(c => c.Id);
            builder.Property(c => c.EnrollmentId).IsRequired();
            builder.Property(c => c.Name).IsRequired();
            builder.HasMany(c => c.Contacts).WithMany();
        }
    }
}

public class CereemContext(DbContextOptions<CereemContext> options) : DbContext(options)
{
    public DbSet<Contact> Contacts => Set<Contact>();
    public DbSet<Company> Companies => Set<Company>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
}
