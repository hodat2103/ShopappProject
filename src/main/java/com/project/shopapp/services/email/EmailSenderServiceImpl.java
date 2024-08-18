package com.project.shopapp.services.email;

public interface EmailSenderServiceImpl {
    void senderEmail(String toEmail,
                     String subject,
                     String body);
}
