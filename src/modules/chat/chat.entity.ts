import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Message } from './message/message.entity';

@Entity()
export abstract class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  modelRole: string;

  @OneToMany(() => Message, message => message.chat, { cascade: ['insert'] })
  messages: Message[];

  @ManyToOne(() => User, user => user.chats, { onDelete: 'CASCADE' })
  user: User;
}
