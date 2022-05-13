import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './Entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenEntity } from './Entities/refresh.token.entity';
import { MailConfirmationService } from '../mailconfirmation/mailconfirmation.service';
import { JwtExportModule } from 'src/jwtmodule/jwtmodule.module';
import { MailconfirmationModule } from 'src/mailconfirmation/mailconfirmation.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity]),
    JwtExportModule,
    MailModule,
    MailconfirmationModule,
  ],
  providers: [AuthResolver, AuthService, MailConfirmationService],
})
export class AuthModule {}
