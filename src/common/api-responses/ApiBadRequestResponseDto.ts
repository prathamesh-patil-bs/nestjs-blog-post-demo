import { ApiProperty } from '@nestjs/swagger';

export class ApiBadRequestResponseDto {
  @ApiProperty({
    description: 'Error status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    examples: [
      'refreshToken is required!',
      'Invalid link!',
      'Invalid token!',
      'Invalid password!',
    ],
  })
  message: string;

  @ApiProperty({
    description: 'Error',
    example: 'Bad Request',
  })
  error: string;
}
