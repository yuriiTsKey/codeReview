import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RefreshInputDto {
  @Field()
  email: string;

  @Field()
  refresh_token: string;
}
