namespace Cereem.WebApi.Features.Contacts;

public partial class ContactController
{
    [HttpGet("{contactId}")]
    [ProducesResponseType<GetContactDetailsResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetContactDetailsAsync(
        string contactId,
        [FromServices]
        GetContactDetailsHandler handler)
    {
        CereemResult<GetContactDetailsResponse> result = await handler
            .Handle(contactId);

        if (!result.IsSuccessful)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Data);
    }

    public class GetContactDetailsResponse
    {
        public required string Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public required string CompanyId { get; set; }
        public required string CompanyName { get; set; }
    }

    [Injectable]
    public class GetContactDetailsHandler(CereemContext context)
    {
        public async Task<CereemResult<GetContactDetailsResponse>> Handle(
            string contactId)
        {
            Contact? contact = await context.Contacts
                .Include(c => c.Company)
                .FirstOrDefaultAsync(c => c.ContactId == contactId);

            if (contact is null)
            {
                return CereemResult<GetContactDetailsResponse>.Failure("Contact not found.");
            }

            return CereemResult<GetContactDetailsResponse>.Success(new GetContactDetailsResponse
            {
                Name = contact.Name,
                Email = contact.Email,
                Phone = contact.Phone,
                CompanyId = contact.Company!.CompanyId,
                CompanyName = contact.Company.Name
            });
        }
    }
}
