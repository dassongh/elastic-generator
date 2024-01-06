import { DataSource, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { Chat } from './chat.entity';
import { GetChatsRawData } from './chat.interfaces';

import { Pagination } from '../../common/interfaces';

@Injectable()
export class ChatRepository extends Repository<Chat> {
  constructor(dataSource: DataSource) {
    super(Chat, dataSource.createEntityManager());
  }

  public async getChats(userId: number, { limit, offset }: Pagination): Promise<GetChatsRawData[]> {
    return this.query(
      `
      SELECT c.id, c."modelRole", c."userId", c."createdAt" AS "chatCreatedAt",
         m1.id AS "messageId", m1.content, m1.role, m1."createdAt" AS "messageCreatedAt"
      FROM chat c
      JOIN message m1 ON c.id = m1."chatId"
      LEFT OUTER JOIN message m2 ON (c.id = m2."chatId" AND
        (m1."createdAt" < m2."createdAt" OR (m1."createdAt" = m2."createdAt" AND m1.id < m2.id)))
      WHERE c."userId" = $1 AND m2.id IS NULL OR m1.id = m2.id
      ORDER BY m1."createdAt" DESC
      LIMIT $2 OFFSET $3
    `,
      [userId, limit, offset]
    );
  }
}
