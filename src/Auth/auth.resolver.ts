import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegistrationDto } from './Dto/registration.dto';
import { UserEntity } from './Entities/user.entity';

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
}
