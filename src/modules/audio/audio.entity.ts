import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Voice } from '../openai/openai.constants';
import { User } from '../user/user.entity';

@Entity()
export abstract class AudioLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  fileName: string;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: Voice })
  voice: Voice;

  @Column()
  transcription: string;

  @ManyToOne(() => User, user => user.audioLinks, { onDelete: 'CASCADE' })
  user: User;
}
