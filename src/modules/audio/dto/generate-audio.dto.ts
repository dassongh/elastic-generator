import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { Voice } from '../../openai/openai.constants';

export abstract class GenerateAudioDto {
  @IsString()
  @Length(1, 64)
  @IsNotEmpty()
  title: string;

  @IsString()
  @Length(1, 4096)
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsEnum(Voice)
  @IsNotEmpty()
  voice: Voice;
}
