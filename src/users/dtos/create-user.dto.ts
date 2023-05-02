import {
  Max,
  Min,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsPositive,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Min(12)
  @Max(100)
  @IsNumber()
  @IsPositive()
  age: number;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
