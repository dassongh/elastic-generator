import { IsNotEmpty, IsString, Length } from 'class-validator';

export abstract class GenerateMessageDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 1000)
  content: string;
}
