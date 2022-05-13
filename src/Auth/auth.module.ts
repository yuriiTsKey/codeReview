import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './Entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenEntity } from './Entities/refresh.token.entity';
import { MailConfirmationService } from '../mailconfirmation/mailconfirmation.service';
import { JwtmoduleModule } from 'src/jwtmodule/jwtmodule.module';
import { MailconfirmationModule } from 'src/mailconfirmation/mailconfirmation.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity]),
    JwtmoduleModule,
    MailModule,
    MailconfirmationModule,
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
