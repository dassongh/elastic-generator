import { IsNotEmpty, IsString, Length } from 'class-validator';

export abstract class GenerateAudioDto {
  @IsString()
  @Length(1, 64)
  @IsNotEmpty()
  title: string;

  @IsString()
  @Length(1, 4096)
  @IsNotEmpty()
  text: string;
}
