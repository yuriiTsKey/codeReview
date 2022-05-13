import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export default class MailService {
  private nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }
}
