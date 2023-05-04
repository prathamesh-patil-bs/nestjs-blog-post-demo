import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {} from 'typeorm';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  text: string;
}
