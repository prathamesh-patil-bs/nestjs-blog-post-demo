import {
  Max,
  Min,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsPositive,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'First name of user.',
    example: 'Prathamesh',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'Last name of user.',
    example: 'Patil',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    type: Number,
    description: 'Age of user.',
    example: 24,
    minimum: 12,
    maximum: 100,
  })
  @Min(12)
  @Max(100)
  @IsNumber()
  @IsPositive()
  age: number;

  @ApiProperty({
    type: String,
    description: 'Email of user.',
    example: 'pratham@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'Password of user.',
    example: 'Password@1234',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
