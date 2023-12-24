import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserView } from './user.view';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService, UserView],
  exports: [UserService, UserView],
})
export class UserModule {}
