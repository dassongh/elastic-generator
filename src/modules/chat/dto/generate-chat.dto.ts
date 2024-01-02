import { IsString, Length } from 'class-validator';

export abstract class GenerateChatDto {
  @IsString()
  @Length(1, 100)
  modelRole: string;
}
