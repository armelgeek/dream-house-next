import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { MessageNotificationEmail } from '../components/email-templates/message-notification';

export class MessageEmailService {
  private static transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  static async sendMessageNotification({
    recipientEmail,
    recipientName,
    senderName,
    message,
    propertyTitle,
  }: {
    recipientEmail: string;
    recipientName: string;
    senderName: string;
    message: string;
    propertyTitle?: string;
  }) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('SMTP credentials not configured. Skipping email notification.');
      return;
    }

    try {
      const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/messages`;
      
      const emailHtml = render(
        MessageNotificationEmail({
          recipientName,
          senderName,
          message,
          propertyTitle,
          dashboardUrl,
        })
      );

      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: recipientEmail,
        subject: `New message from ${senderName} on Dream House`,
        html: emailHtml,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Message notification email sent to ${recipientEmail}`);
    } catch (error) {
      console.error('Failed to send message notification email:', error);
    }
  }
}