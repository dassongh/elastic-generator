import { Injectable } from '@nestjs/common';
import { GetUserViewDto } from './dto/get-user-view.dto';
import { User } from './user.entity';

@Injectable()
export class UserView {
  public getUser(user: User): GetUserViewDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
