import {
  Max,
  Min,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNumber()
  @IsPositive()
  @Min(12)
  @Max(100)
  age: number;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
