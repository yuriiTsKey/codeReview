import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail } from 'class-validator';

@ObjectType()
@Entity()
export class UserEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment', { name: 'userid' })
  id: number;

  @Field(() => String)
  @Column()
  firstname: string;

  @Field(() => String)
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Field(() => String)
  @Column({ nullable: false, select: false })
  password: string;

  @Field(() => String)
  @Column({ nullable: true, name: 'refreshtoken' })
  refresh_token: string;
}
