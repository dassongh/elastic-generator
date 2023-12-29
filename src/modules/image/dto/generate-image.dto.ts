import { IsNotEmpty, IsString, Length } from 'class-validator';

export abstract class GenerateImageDto {
  @IsString()
  @Length(1, 64)
  @IsNotEmpty()
  title: string;

  @IsString()
  @Length(1, 1000)
  @IsNotEmpty()
  prompt: string;
}
