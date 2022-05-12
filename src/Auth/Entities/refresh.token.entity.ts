import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class RefreshTokenEntity {
  @Column()
  @PrimaryGeneratedColumn()
  refreshid: number;

  @Column()
  token: string;

  @ManyToOne(() => UserEntity, (user) => user.tokens)
  @JoinColumn({ name: 'token_id_user' })
  user: UserEntity;
}
