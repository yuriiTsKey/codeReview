import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { MailConfirmationService } from './mailconfirmation.service';
import { AuthModule } from 'src/Auth/auth.module';
import { JwtmoduleModule } from 'src/jwtmodule/jwtmodule.module';

@Module({
  imports: [ConfigModule, MailModule, JwtmoduleModule],
  providers: [MailConfirmationService],
  exports: [MailConfirmationService],
  controllers: [],
})
export class MailconfirmationModule {}
