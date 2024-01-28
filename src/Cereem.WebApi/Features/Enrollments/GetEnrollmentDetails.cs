namespace Cereem.WebApi.Features.Enrollments;

public partial class EnrollmentController
{
    [HttpGet]
    [Route("{enrollmentId}")]
    [ProducesResponseType<GetEnrollmentDetailsResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetEnrollmentDetailsAsync(
        string enrollmentId,
        [FromServices]
        GetEnrollmentDetailsHandler handler)
    {
        CereemResult<GetEnrollmentDetailsResponse> result = await handler.HandleAsync(enrollmentId);

        if (!result.IsSuccessful)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Data);
    }
    
    public class GetEnrollmentDetailsResponse
    {
        public required string Name { get; set; }
        public required string State { get; set; }
        public required DateTime Deadline { get; set; }
        public required List<EnrollmentContact> Contacts { get; set; } = [];
    }

    public class EnrollmentContact
    {
        public required string ContactId { get; set; }
        public required string Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
    }

    [Injectable]
    public class GetEnrollmentDetailsHandler(CereemContext context)
    {
        public async Task<CereemResult<GetEnrollmentDetailsResponse>> HandleAsync(string enrollmentId)
        {
            Enrollment? enrollment = await context.Enrollments
                .Include(e => e.Contacts)
                .FirstOrDefaultAsync(e => e.EnrollmentId == enrollmentId);

            if (enrollment == null)
            {
                return CereemResult<GetEnrollmentDetailsResponse>.Failure("Enrollment not found");
            }

            GetEnrollmentDetailsResponse response = new()
            {
                Name = enrollment.Name,
                State = enrollment.State.ToString(),
                Deadline = enrollment.Deadline,
                Contacts = enrollment.Contacts.Select(c => new EnrollmentContact
                {
                    ContactId = c.ContactId,
                    Name = c.Name,
                    Email = c.Email,
                    Phone = c.Phone
                }).ToList()
            };

            return CereemResult<GetEnrollmentDetailsResponse>.Success(response);
        }
    }
}
