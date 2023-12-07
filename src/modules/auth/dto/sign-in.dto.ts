import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export abstract class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
