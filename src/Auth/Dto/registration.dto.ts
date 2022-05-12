import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType({ description: 'registration input data' })
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
