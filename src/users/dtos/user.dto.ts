import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  @ApiProperty({ description: "users's id", example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ description: "users's firstname", example: 'Prathamesh' })
  firstName: string;

  @Expose()
  @ApiProperty({ description: "users's lastname", example: 'Patil' })
  lastName: string;

  @Expose()
  @ApiProperty({
    description: "users's email address",
    example: 'pratham@gmail.com',
  })
  email: string;

  @Expose()
  @ApiProperty({ description: "users's age", example: 24 })
  age: number;

  @Expose()
  @ApiProperty({ description: "users's role", example: 'user' })
  role: string;

  @Expose()
  @ApiProperty({ description: "Date of user's account creation" })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: "Date of user's account info updatation." })
  updatedAt: Date;
}
