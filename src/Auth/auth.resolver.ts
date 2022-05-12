import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginDto } from './Dto/login.dto';
import { RegistrationDto } from './Dto/registration.dto';
import { TokenResponse } from './Dto/tokens.dto';
import { RegistrationResDto } from './Dto/user.res.dto';
import { GqlAuthGuard } from './Guards/auth.guard';
import { TokenInputData } from './Interfaces/token.input.interface';

@Resolver()
export class AuthResolver {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Query(() => String)
  async test(): Promise<string> {
    return 'yes';
  }

  @Mutation(() => RegistrationResDto)
  async registration(
    @Args('registerdata') registerdata: RegistrationDto,
  ): Promise<RegistrationResDto> {
    return this.authService.registration(registerdata);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => RegistrationResDto)
  async login(
    @Args('loginDto') loginDto: LoginDto,
  ): Promise<RegistrationResDto> {
    return this.authService.login(loginDto);
  }

  @Mutation(() => TokenResponse)
  async getToken(@Args('loginDto') loginDto: TokenInputData) {
    return this.authService.getTokens(loginDto);
  }
}
