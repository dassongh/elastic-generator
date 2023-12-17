import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export abstract class AudioLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  link: string;

  @ManyToOne(() => User, user => user.audioLinks, { onDelete: 'CASCADE' })
  user: User;
}
