package com.mlr.service;

import com.mlr.dto.ContactRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String myEmail;

    @Value("${contact.to.email}")
    private String adminEmail;

    public void sendContactMail(ContactRequestDto request) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(myEmail);
        
        message.setReplyTo(request.getEmail());

        message.setTo(adminEmail);

        message.setSubject("New Contact Msg: " + request.getSubject());
        
        String body = "Name: " + request.getName() + "\n" +
                      "Email: " + request.getEmail() + "\n\n" +
                      "Message:\n" + request.getMessage();
        
        message.setText(body);

        mailSender.send(message);
        System.out.println("Email sent successfully from " + myEmail);
    }
}