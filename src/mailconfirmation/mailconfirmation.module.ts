import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';

@Module({
  providers: [MailconfirmationModule],
  imports: [MailModule],
  exports: [MailconfirmationModule],
})
export class MailconfirmationModule {}
