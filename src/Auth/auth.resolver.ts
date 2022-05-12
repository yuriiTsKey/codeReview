import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegistrationDto } from './Dto/registration.dto';
import { UserEntity } from './Entities/user.entity';
import { LoginDto } from './Dto/login.dto';

@Resolver()
export class AuthResolver {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Query(() => String)
  async test(): Promise<string> {
    return 'yes';
  }

  @Mutation(() => UserEntity)
  async registration(
    @Args('registerdata') registerdata: RegistrationDto,
  ): Promise<UserEntity> {
    return this.authService.registration(registerdata);
  }

  @Mutation(() => UserEntity)
  async login(@Args('login') login: LoginDto): Promise<UserEntity> {
    return this.authService.login(login);
  }

  @Query(() => String)
  hashPass(): Promise<string> {
    return this.authService.hashPassword('12345');
  }
}
