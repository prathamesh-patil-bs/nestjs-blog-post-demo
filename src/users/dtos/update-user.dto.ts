import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @IsNumber()
  @IsPositive()
  @Min(12)
  @Max(100)
  @IsOptional()
  age?: number;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email?: string;
}
