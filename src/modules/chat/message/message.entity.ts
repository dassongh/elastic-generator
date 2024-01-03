import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Chat } from '../chat.entity';
import { Role } from './message.constants';

@Entity()
export abstract class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column()
  content: string;

  @ManyToOne(() => Chat, chat => chat.messages, { onDelete: 'CASCADE' })
  chat: Chat;
}
