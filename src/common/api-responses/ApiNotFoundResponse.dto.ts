import { ApiProperty } from '@nestjs/swagger';

export class ApiNotFoundResponseDto {
  @ApiProperty({
    description: 'Error status code',
    example: 404,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    examples: [
      'No such user is registered with "pratham@gmail.com"',
      "User doesn't exists!",
      'No such comment exists with id: 1',
      'No such post found with id : 1',
    ],
  })
  message: string;

  @ApiProperty({
    description: 'Error',
    example: 'Not Found',
  })
  error: string;
}
