import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('token')
export class RefreshTokenEntity {
  @Column()
  @PrimaryGeneratedColumn()
  refreshid: number;

  @Column()
  refreshtoken: string;

  @Column({ nullable: true })
  expired: number;

  @ManyToOne(() => UserEntity, (user) => user.tokens)
  @JoinColumn({ name: 'token_id_user' })
  user: UserEntity;
}
