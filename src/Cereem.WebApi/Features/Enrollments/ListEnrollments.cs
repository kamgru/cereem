namespace Cereem.WebApi.Features.Enrollments;

public partial class EnrollmentController
{
    [HttpGet]
    [ProducesResponseType<ListEnrollmentsResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ListEnrollmentsAsync(
        [FromQuery]
        ListEnrollmentsRequest request,
        [FromServices]
        ListEnrollmentsHandler handler)
    {
        CereemResult<ListEnrollmentsResponse> result = await handler
            .HandleAsync(request);

        if (!result.IsSuccessful)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Data);
    }
    
    public class ListEnrollmentsRequest
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public string? SortBy { get; set; }
        public bool IsDescending { get; set; }
        public string? Search { get; set; }
    }

    public class ListEnrollmentsResponse
    {
        public List<EnrollmentItem> Items { get; set; } = [];
        public int TotalCount { get; set; }
    }

    public class EnrollmentItem
    {
        public required string EnrollmentId { get; set; }
        public required string Name { get; set; }
        public int ContactCount { get; set; }
        public required string State { get; set; }
        public required DateTime Deadline { get; set; }
    }

    [Injectable]
    public class ListEnrollmentsHandler(CereemContext context)
    {
        public async Task<CereemResult<ListEnrollmentsResponse>> HandleAsync(
            ListEnrollmentsRequest request)
        {
            IQueryable<EnrollmentItem> query = context.Enrollments
                .Select(x => new EnrollmentItem
                {
                    EnrollmentId = x.EnrollmentId,
                    Name = x.Name,
                    ContactCount = x.Contacts.Count,
                    State = x.State.ToString(),
                    Deadline = x.Deadline
                });

            if (!string.IsNullOrEmpty(request.Search))
            {
                string search = $"%{request.Search}%";
                query = query.Where(x => EF.Functions.ILike(search, x.Name));
            }

            int totalCount = await query.CountAsync();

            query = request.SortBy switch
            {
                "name" when !request.IsDescending => query.OrderBy(x => x.Name),
                "name" when request.IsDescending => query.OrderByDescending(x => x.Name),
                "contactCount" when !request.IsDescending => query.OrderBy(x => x.ContactCount),
                "contactCount" when request.IsDescending => query.OrderByDescending(x => x.ContactCount),
                "state" when !request.IsDescending => query.OrderBy(x => x.State),
                "state" when request.IsDescending => query.OrderByDescending(x => x.State),
                _ => query.OrderBy(x => x.Name)
            };

            List<EnrollmentItem> items = await query
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            return CereemResult<ListEnrollmentsResponse>.Success(new ListEnrollmentsResponse
            {
                Items = items,
                TotalCount = totalCount
            });
        }
    }
}
