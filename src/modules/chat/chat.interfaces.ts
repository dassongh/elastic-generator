import { Role } from './message/message.constants';

export interface GetChatsRawData {
  id: number;
  modelRole: string;
  chatCreatedAt: Date;
  messageId: number;
  content: string;
  role: Role;
  messageCreatedAt: Date;
}
