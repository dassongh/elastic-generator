import { IsNotEmpty, IsString, Length } from 'class-validator';

export abstract class GenerateAudioDto {
  @IsString()
  @Length(1, 4096)
  @IsNotEmpty()
  text: string;
}
