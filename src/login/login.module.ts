import { Module } from '@nestjs/common';
import { LoginResolver } from './login.resolver';
import { LoginService } from './login.service';

@Module({
  providers: [LoginResolver, LoginService]
})
export class LoginModule {}
