namespace Cereem.WebApi.Features.Enrollments;

public partial class EnrollmentController
{
    [HttpPost]
    [Route("open")]
    [ProducesResponseType<OpenEnrollmentResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> OpenEnrollmentAsync(
        OpenEnrollmentRequest request,
        [FromServices]
        OpenEnrollmentHandler handler)
    {
        CereemResult<OpenEnrollmentResponse> result = await handler.HandleAsync(request);
        
        if (!result.IsSuccessful)
        {
            return BadRequest(result.Message);
        }
        
        return Ok(result.Data);
    }

    public class OpenEnrollmentRequest
    {
        public required string Name { get; set; }
        public required DateTime Deadline { get; set; }
    }

    public class OpenEnrollmentResponse
    {
        public required string EnrollmentId { get; set; }
    }

    [Injectable]
    public class OpenEnrollmentHandler(CereemContext context)
    {
        public async Task<CereemResult<OpenEnrollmentResponse>> HandleAsync(
            OpenEnrollmentRequest request)
        {
            Enrollment enrollment = new()
            {
                Name = request.Name,
                Deadline = request.Deadline,
                EnrollmentId = Guid.NewGuid()
                    .ToString(),
                Contacts = []
            };

            context.Enrollments.Add(enrollment);
            await context.SaveChangesAsync();

            return CereemResult<OpenEnrollmentResponse>.Success(new OpenEnrollmentResponse
            {
                EnrollmentId = enrollment.EnrollmentId
            });
        }
    }
}
