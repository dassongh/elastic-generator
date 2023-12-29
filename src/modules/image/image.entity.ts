import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export abstract class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  link: string;

  @Column()
  title: string;

  @Column()
  prompt: string;

  @ManyToOne(() => User, user => user.images, { onDelete: 'CASCADE' })
  user: User;
}
