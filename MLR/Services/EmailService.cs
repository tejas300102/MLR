using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using MLR.DTOs;

namespace MLR.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendContactMail(ContactRequestDto request)
        {
            var smtp = _config.GetSection("SmtpSettings");

            var message = new MailMessage
            {
                From = new MailAddress(smtp["Username"]!),
                Subject = $"Contact Form: {request.Subject}",
                Body =
                $"Name: {request.Name}\n" +
                $"Email: {request.Email}\n\n" +
                $"Message:\n{request.Message}",
                IsBodyHtml = false
            };

            message.To.Add(smtp["ToEmail"]!);

            using var client = new SmtpClient(smtp["Host"], int.Parse(smtp["Port"]!))
            {
                Credentials = new NetworkCredential(
                    smtp["Username"],
                    smtp["Password"]
                ),
                EnableSsl = true
            };

            await client.SendMailAsync(message);
        }
    }
}
