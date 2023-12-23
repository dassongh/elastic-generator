import { IsNotEmpty, IsString } from 'class-validator';

export abstract class SaveUserKeyDto {
  @IsString()
  @IsNotEmpty()
  key: string;
}
