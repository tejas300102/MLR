using Microsoft.AspNetCore.Mvc;
using MLR.DTOs;
using MLR.Services;

namespace MLR.Controllers
{
    [ApiController]
    [Route("api/contact")]
    public class ContactController : ControllerBase
    {
        private readonly EmailService _emailService;

        public ContactController(EmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> Send([FromBody] ContactRequestDto request)
        {
            if (request == null)
                return BadRequest("Invalid request");

            try
            {
                await _emailService.SendContactMail(request);

                return Ok(new
                {
                    message = "Message sent successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Failed to send message",
                    error = ex.Message
                });
            }
        }
    }
}
