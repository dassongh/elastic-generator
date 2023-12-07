import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  public async signUp(@Body() dto: SignUpDto) {
    const user = await this.authService.signUp(dto);
    return { data: user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  public async signIn(@Body() dto: SignInDto) {
    const tokens = await this.authService.signIn(dto);
    return { data: tokens };
  }
}
