import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType({ description: 'login input dto' })
export class LoginDto {
  @Field()
  email: string;

  @Field()
  password: string;
}
