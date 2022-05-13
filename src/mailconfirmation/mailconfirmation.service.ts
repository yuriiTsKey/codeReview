import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/Auth/auth.service';
import MailService from 'src/mail/mail.service';
import VerificationTokenPayload from './Interface/verificationTokenPayload.interface';

@Injectable()
export class MailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly emailService: MailService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
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

  async resendVerificationLink(userMail: string): Promise<boolean> {
    const user = await this.authService.getUserByMail(userMail);
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.sendVerificationLink(user.email);
    return true;
  }

  async getDataFromEmailToken(token): Promise<string> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_EMAIL_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
    } catch (error) {
      throw Error('Cannot read payload from email token');
    }
  }
}
