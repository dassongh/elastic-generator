import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Chat } from '../chat.entity';
import { Role } from './message.constants';

@Entity()
export abstract class Message {
  @PrimaryColumn()
  id: number;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column()
  content: string;

  @ManyToOne(() => Chat, chat => chat.messages, { onDelete: 'CASCADE' })
  chat: Chat;
}
