import { DataSource, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { Chat } from './chat.entity';

@Injectable()
export class ChatRepository extends Repository<Chat> {
  constructor(dataSource: DataSource) {
    super(Chat, dataSource.createEntityManager());
  }
}
