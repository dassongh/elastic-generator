import { DataSource, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { Message } from './message.entity';

@Injectable()
export class MessageRepository extends Repository<Message> {
  constructor(dataSource: DataSource) {
    super(Message, dataSource.createEntityManager());
  }
}
