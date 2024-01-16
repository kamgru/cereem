namespace Cereem.WebApi.Features.Contacts;

public partial class ContactController
{
    [HttpPost]
    public async Task<IActionResult> AddContactAsync(
        AddContactRequest request,
        [FromServices]
        AddContactHandler handler)

    {
        CereemResult<AddContactResponse> result = await handler
            .HandleAsync(request);

        if (!result.IsSuccessful)
        {
            return BadRequest(result.Message);
        }

        return Created();
    }

    public class AddContactRequest
    {
        public required string Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
    }

    public class AddContactResponse
    {
        public required string ContactId { get; set; }
    }

    [Injectable]
    public class AddContactHandler(CereemContext context)
    {
        public async Task<CereemResult<AddContactResponse>> HandleAsync(
            AddContactRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.Email))
            {
                Contact? existingContact = await context.Contacts
                    .FirstOrDefaultAsync(c => c.Email == request.Email);

                if (existingContact is not null)
                {
                    return CereemResult<AddContactResponse>.Failure("Contact already exists.");
                }
            }
            
            if (!string.IsNullOrWhiteSpace(request.Phone))
            {
                Contact? existingContact = await context.Contacts
                    .FirstOrDefaultAsync(c => c.Phone == request.Phone);

                if (existingContact is not null)
                {
                    return CereemResult<AddContactResponse>.Failure("Contact already exists.");
                }
            }
            
            Contact contact = new()
            {
                ContactId = Guid.NewGuid().ToString(),
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone
            };
            
            context.Contacts.Add(contact);
            await context.SaveChangesAsync();
            
            return CereemResult<AddContactResponse>.Success(new AddContactResponse
            {
                ContactId = contact.ContactId
            });
        }
    }
}
