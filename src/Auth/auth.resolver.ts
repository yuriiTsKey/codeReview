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
import { UserIp } from 'src/Auth/Consts/IpAddress';
import { Get, Ip } from '@nestjs/common';
import { MailConfirmationService } from 'src/mailconfirmation/mailconfirmation.service';
import { TokenInputDto } from './Dto/email.token.dto';
import { EmailDto } from './Dto/email.dto';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    private readonly emailConfirmationService: MailConfirmationService,
  ) {}

  @Query(() => String)
  async test(@UserIp() ip) {
    console.log(ip);
    return 'sdf';
  }

  @Mutation(() => TokenResponse)
  async registration(
    @Args('registerdata') registerdata: RegistrationDto,
  ): Promise<TokenResponse> {
    const token = await this.authService.registration(registerdata);
    await this.emailConfirmationService.sendVerificationLink(
      registerdata.email,
    );
    return token;
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

  @Mutation(() => String)
  async confirmEmailVerification(
    @Args('tokenInput') tokenInput: TokenInputDto,
  ): Promise<string> {
    const email = await this.emailConfirmationService.getDataFromEmailToken(
      tokenInput.emailToken,
    );
    return email;
  }

  @Mutation(() => String)
  async resentConfirmationLink(
    @Args('email') email: EmailDto,
  ): Promise<boolean> {
    const result = await this.emailConfirmationService.resendVerificationLink(
      email.email,
    );
    return true;
  }

  @Cron('0 */5 * * *')
  runEvery5Hour() {
    return this.authService.deleteExpireToken();
  }
}
