import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class TokenInputDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  emailToken: string;
}
