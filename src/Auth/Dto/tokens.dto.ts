import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType({ description: 'Output result for registration' })
export class TokenResponse {
  @Field()
  access_Token: string;

  @Field()
  refresh_Token: string;
}
