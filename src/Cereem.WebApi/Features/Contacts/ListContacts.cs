namespace Cereem.WebApi.Features.Contacts;

public partial class ContactController
{
    [HttpGet]
    [ProducesResponseType<ListContactsResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ListContactsAsync(
        [FromQuery]
        ListContactsRequest request,
        [FromServices]
        ListContactsHandler handler)
    {
        CereemResult<ListContactsResponse> result = await handler
            .HandleAsync(request);

        if (!result.IsSuccessful)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Data);
    }

    public class ListContactsRequest
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public string? Search { get; set; }
        public string? SortBy { get; set; }
        public bool SortDescending { get; set; }
    }

    public class ContactItem
    {
        public required string ContactId { get; set; }
        public required string Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Company { get; set; }
    }

    public class ListContactsResponse
    {
        public int TotalCount { get; set; }
        public List<ContactItem> Items { get; set; } = [];
    }

    [Injectable]
    public class ListContactsHandler(CereemContext context)
    {
        public async Task<CereemResult<ListContactsResponse>> HandleAsync(
            ListContactsRequest request)
        {
            request.Page = Math.Max(request.Page, 1);
            request.PageSize = Math.Clamp(request.PageSize, 1, 100);

            IQueryable<Contact> query = context.Contacts.AsQueryable().AsNoTracking();

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                string search = $"%{request.Search}%";
                query = query.Where(c => EF.Functions.ILike(c.Name, search)
                                         || EF.Functions.ILike(c.Company!.Name, search));
            }

            query = request.SortBy?.ToLowerInvariant() switch
            {
                "name" => request.SortDescending
                    ? query.OrderByDescending(c => c.Name)
                    : query.OrderBy(c => c.Name),
                "company" => request.SortDescending
                    ? query.OrderByDescending(c => c.Company!.Name)
                    : query.OrderBy(c => c.Company!.Name),
                _ => query.OrderBy(c => c.Name)
            };

            int totalCount = await query.CountAsync();

            List<ContactItem> contacts = await query
                .Include(c => c.Company)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .Select(c => new ContactItem
                {
                    ContactId = c.ContactId,
                    Name = c.Name,
                    Email = c.Email,
                    Phone = c.Phone,
                    Company = c.Company!.Name
                })
                .ToListAsync();

            return CereemResult<ListContactsResponse>.Success(new ListContactsResponse
            {
                TotalCount = totalCount,
                Items = contacts
            });
        }
    }
}
