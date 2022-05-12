import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RefreshTokenEntity {
  @Column()
  @PrimaryGeneratedColumn()
  refreshid: number;

  @Column()
  token: string;
}
