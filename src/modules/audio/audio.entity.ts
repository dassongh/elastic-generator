import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Voice } from '../openai/openai.constants';
import { User } from '../user/user.entity';

@Entity()
export abstract class Audio {
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

  @ManyToOne(() => User, user => user.audios, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
