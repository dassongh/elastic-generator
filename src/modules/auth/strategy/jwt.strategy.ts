import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../../user/user.entity';
import { UserView } from '../../user/user.view';
import { TokenPayload } from '../auth.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    @InjectRepository(User) private userRepository: Repository<User>,
    private userView: UserView
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('ACCESS_TOKEN_SECRET'),
    });
  }

  public async validate(payload: TokenPayload) {
    const user = await this.userRepository.findOneBy({ id: payload.sub });
    if (!user) return null;
    return this.userView.getUser(user);
  }
}
