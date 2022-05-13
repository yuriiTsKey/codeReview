import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cron } from '@nestjs/schedule';
import { UserIp } from 'src/Auth/Consts/IpAddress';
import { MailConfirmationService } from 'src/mailconfirmation/mailconfirmation.service';
import { AuthService } from './auth.service';
import { TokenInputDto } from './Dto/email.token.dto';
import { LoginDto } from './Dto/login.dto';
import { RefreshInputDto } from './Dto/refresh.token.dto';
import { RegistrationDto } from './Dto/registration.dto';
import { TokenResponse } from './Dto/tokens.dto';
import { GqlAuthGuard } from './Guards/auth.guard';

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

  @Cron('0 */5 * * *')
  runEvery5Hour() {
    return this.authService.deleteExpireToken();
  }
}
