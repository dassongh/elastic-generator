import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Message } from './message/message.entity';

@Entity()
export abstract class Chat {
  @PrimaryColumn()
  id: number;

  @Column()
  modelRole: string;

  @OneToMany(() => Message, message => message.chat)
  messages: Message[];
}
