import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Message } from './message/message.entity';

@Entity()
export abstract class Chat {
  @PrimaryColumn()
  id: number;

  @Column({ default: 'You are a helpful assistant' })
  modelRole: string;

  @OneToMany(() => Message, message => message.chat, { cascade: ['insert'] })
  messages: Message[];
}
