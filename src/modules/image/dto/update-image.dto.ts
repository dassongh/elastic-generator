import { IsNotEmpty, IsString, Length } from 'class-validator';

export abstract class UpdateImageDto {
  @IsString()
  @Length(1, 64)
  @IsNotEmpty()
  title: string;
}
