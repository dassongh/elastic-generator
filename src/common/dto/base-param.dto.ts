import { IsNotEmpty, IsNumberString } from 'class-validator';

export abstract class BaseParamDto {
  @IsNotEmpty()
  @IsNumberString()
  id: number;
}
