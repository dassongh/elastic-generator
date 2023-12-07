import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GetUserViewDto } from './dto/get-user-view.dto';
import { User } from './user.entity';
import { UserView } from './user.view';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private userView: UserView
  ) {}

  public async getById(id: number): Promise<GetUserViewDto> {
    const user = await this.userRepository.findOneByOrFail({ id });
    return this.userView.getUser(user);
  }
}
