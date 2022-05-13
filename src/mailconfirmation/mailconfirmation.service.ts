import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import MailService from 'src/mail/mail.service';
import VerificationTokenPayload from './Interface/verificationTokenPayload.interface';

@Injectable()
export class MailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly confgiModule: ConfigModule,
    private readonly emailService: MailService,
  ) {}

  public sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIME}s`,
    });

    const url = `${process.env.EMAIL_CONFIRMATION_URL}?token=${token}`;

    const text = `Welcome to the application. Confirm you email in 12 hour, click here: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Email confirmation',
      text,
    });
  }
}
