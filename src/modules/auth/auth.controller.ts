import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';

import { Response } from '../../common/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  public async signUp(@Body() dto: SignUpDto): Promise<Response> {
    const user = await this.authService.signUp(dto);
    return { data: user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  public async signIn(@Body() dto: SignInDto): Promise<Response> {
    const tokens = await this.authService.signIn(dto);
    return { data: tokens };
  }
}
