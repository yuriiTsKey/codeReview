import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class LoginResolver {
  @Query()
  async test(): Promise<string> {
    return 'yes';
  }
}
