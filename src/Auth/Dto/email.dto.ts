import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class EmailDto {
  @Field()
  @IsEmail()
  email: string;
}
