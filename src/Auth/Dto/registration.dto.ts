import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class RegistrationDto {
  @Field()
  firstname: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;

  @Field()
  confirmationPassword: string;
}
