import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType({ description: 'Access and refresh tokens' })
export class TokenResponse {
  @Field()
  access_Token: string;

  @Field()
  refresh_Token: string;
}
