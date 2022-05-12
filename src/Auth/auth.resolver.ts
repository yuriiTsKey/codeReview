import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegistrationDto } from './Dto/registration.dto';
import { UserEntity } from './Entities/user.entity';
import { LoginDto } from './Dto/login.dto';
import { RegistrationResDto } from './Dto/user.res.dto';

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

  @Mutation(() => RegistrationResDto)
  async login(
    @Args('loginDto') loginDto: LoginDto,
  ): Promise<RegistrationResDto> {
    return this.authService.login(loginDto);
  }
}
