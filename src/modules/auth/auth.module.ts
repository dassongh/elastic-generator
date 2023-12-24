import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';

import { User } from '../user/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User]), UserModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
