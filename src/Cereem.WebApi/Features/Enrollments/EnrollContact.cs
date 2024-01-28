namespace Cereem.WebApi.Features.Enrollments;

public partial class EnrollmentController
{
    [HttpPost]
    [Route("{enrollmentId}/enroll")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> EnrollContactAsync(
        string enrollmentId,
        EnrollContactRequest request,
        [FromServices]
        EnrollContactHandler handler)
    {
        CereemResult result = await handler.HandleAsync(enrollmentId, request);

        if (!result.IsSuccessful)
        {
            return BadRequest(result.Message);
        }

        return Ok();
    }

    public class EnrollContactRequest
    {
        public required string ContactId { get; set; }
    }

    [Injectable]
    public class EnrollContactHandler(CereemContext context)
    {
        public async Task<CereemResult> HandleAsync(
            string enrollmentId,
            EnrollContactRequest request)
        {
            Enrollment? enrollment = await context.Enrollments
                .Include(e => e.Contacts)
                .FirstOrDefaultAsync(e => e.EnrollmentId == enrollmentId);

            if (enrollment == null)
            {
                return CereemResult.Failure("Enrollment not found");
            }

            Contact? contact = await context.Contacts
                .FirstOrDefaultAsync(c => c.ContactId == request.ContactId);

            if (contact == null)
            {
                return CereemResult.Failure("Contact not found");
            }

            if (enrollment.Contacts.Any(c => c.ContactId == contact.ContactId))
            {
                return CereemResult.Failure("Contact already enrolled");
            }
            
            if (enrollment.State != EnrollmentState.Open)
            {
                return CereemResult.Failure("Enrollment is not open");
            }
            
            if (enrollment.Deadline < DateTime.UtcNow)
            {
                return CereemResult.Failure("Enrollment deadline has passed");
            }

            enrollment.Contacts.Add(contact);
            await context.SaveChangesAsync();

            return CereemResult.Success();
        }
    }
}
