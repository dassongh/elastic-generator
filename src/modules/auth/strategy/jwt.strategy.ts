import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { UserRepository } from '../../user/user.repository';
import { UserView } from '../../user/user.view';
import { TokenPayload } from '../auth.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private userRepository: UserRepository,
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
