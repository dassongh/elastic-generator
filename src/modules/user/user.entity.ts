import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Audio } from '../audio/audio.entity';
import { Image } from '../image/image.entity';

@Entity()
export abstract class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Audio, audio => audio.user)
  audios: Audio[];

  @OneToMany(() => Image, image => image.user)
  images: Image[];

  @Column({ nullable: true })
  openAiKey: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
