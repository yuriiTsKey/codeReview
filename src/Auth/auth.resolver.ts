import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
  @Query(() => String)
  async test(): Promise<string> {
    return 'yes';
  }
}
