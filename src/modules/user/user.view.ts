import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { GetUserView } from './user.interfaces';

@Injectable()
export class UserView {
  public getUser(user: User): GetUserView {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
