import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserView } from './user.view';

@Module({
  controllers: [UserController],
  providers: [UserService, UserView, UserRepository],
  exports: [UserService, UserView, UserRepository],
})
export class UserModule {}
