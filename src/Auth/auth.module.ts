import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './Entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { RefreshTokenEntity } from './Entities/refresh.token.entity';
import MailService from 'src/mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity]),
    JwtModule.register({}),
    MailService,
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
