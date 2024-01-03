import { UpdateResult } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { GetUserViewDto } from './dto';
import { UserRepository } from './user.repository';
import { UserView } from './user.view';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private userView: UserView
  ) {}

  public async getById(id: number): Promise<GetUserViewDto> {
    const user = await this.userRepository.findOneByOrFail({ id });
    return this.userView.getUser(user);
  }

  public async saveOpenAiKey(id: number, key: string): Promise<UpdateResult> {
    return this.userRepository.update({ id }, { openAiKey: key });
  }

  public async removeOpenAiKey(id: number): Promise<UpdateResult> {
    return this.userRepository.update({ id }, { openAiKey: null });
  }
}
