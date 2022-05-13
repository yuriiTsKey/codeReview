import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtmoduleModule } from 'src/jwtmodule/jwtmodule.module';
import { MailModule } from 'src/mail/mail.module';
import { MailConfirmationService } from './mailconfirmation.service';

@Module({
  imports: [ConfigModule, MailModule, JwtmoduleModule],
  providers: [MailConfirmationService],
  exports: [MailConfirmationService],
  controllers: [],
})
export class MailconfirmationModule {}
