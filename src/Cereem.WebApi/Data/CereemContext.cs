using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Cereem.WebApi.Data;

public class Contact
{
    public int Id { get; set; }
    public required string ContactId { get; set; }
    public required string Name { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    
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


public class CereemContext(DbContextOptions<CereemContext> options) : DbContext(options)
{
    public DbSet<Contact> Contacts => Set<Contact>();
}
