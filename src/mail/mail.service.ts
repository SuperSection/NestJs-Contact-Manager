import { Injectable } from '@nestjs/common';
import Mailgun from 'mailgun.js';

@Injectable()
export class MailService {
  private mg: Mailgun;

  // constructor(
  //   private readonly apiKey: string,
  //   private readonly domain: string,
  // ) {
  //   this.mg = mailgun({ apiKey, domain });
  // }

  // async sendVerificationEmail(to: string, verificationToken: string) {
  //   const data = {
  //     from: 'Your Name <your_email@example.com>',
  //     to,
  //     subject: 'Email Verification',
  //     html: `
  //       Click on the link below to verify your email address: <br>
  //       <a href="http://localhost:3000/verify?token=${verificationToken}">Verify Email</a>
  //     `,
  //   };

  //   try {
  //     await this.mg.messages().send(data);
  //     console.log('Email sent successfully!');
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //     throw error; // Or handle error appropriately
  //   }
  // }
}
