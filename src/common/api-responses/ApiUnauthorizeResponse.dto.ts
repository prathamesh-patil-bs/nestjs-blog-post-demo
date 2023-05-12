import { ApiProperty } from '@nestjs/swagger';

export class ApiUnauthorizedResponseDto {
  @ApiProperty({
    description: 'Error status code',
    example: 401,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Unauthorized',
  })
  message: string;
}
