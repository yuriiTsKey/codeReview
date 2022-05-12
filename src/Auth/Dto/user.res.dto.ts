import { ObjectType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ObjectType()
export class RegistrationResDto {
  @Field()
  id: number;

  @Field()
  firstname: string;

  @Field()
  @IsEmail()
  email: string;
}
