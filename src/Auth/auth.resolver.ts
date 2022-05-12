import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cron } from '@nestjs/schedule';
import { Token } from 'graphql';
import { argsToArgsConfig } from 'graphql/type/definition';
import { number } from 'joi';
import { AuthService } from './auth.service';
import { LoginDto } from './Dto/login.dto';
import { RefreshInputDto } from './Dto/refresh.token.dto';
import { RegistrationDto } from './Dto/registration.dto';
import { TokenResponse } from './Dto/tokens.dto';
import { RegistrationResDto } from './Dto/user.res.dto';
import { GqlAuthGuard } from './Guards/auth.guard';
import { RealIP } from 'nestjs-real-ip';
import { UserIp } from 'src/Consts/IpAddress';
import { Get, Ip } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Query(() => String)
  async test(@UserIp() ip) {
    console.log(ip);
    return 'sdf';
  }

  @Mutation(() => TokenResponse)
  async registration(
    @Args('registerdata') registerdata: RegistrationDto,
  ): Promise<TokenResponse> {
    return this.authService.registration(registerdata);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TokenResponse)
  async login(@Args('loginDto') loginDto: LoginDto): Promise<TokenResponse> {
    return this.authService.login(loginDto);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TokenResponse)
  async changeRefresh(
    @Args('RefreshInputDto') refreshInputDto: RefreshInputDto,
  ): Promise<TokenResponse> {
    return this.authService.chageRefreshToken(refreshInputDto);
  }

  @Cron('0 */5 * * *')
  runEvery5Hour() {
    return this.authService.deleteExpireToken();
  }
}
