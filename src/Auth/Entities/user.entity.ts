import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail } from 'class-validator';
import { RefreshTokenEntity } from './refresh.token.entity';

@ObjectType({ description: 'User entity' })
@Entity('user')
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

  @Column({ default: false })
  isEmailConfirmed: boolean;

  @OneToMany(() => RefreshTokenEntity, (user) => user.refreshid)
  tokens: RefreshTokenEntity[];
}
