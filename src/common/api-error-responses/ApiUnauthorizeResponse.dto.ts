import { ApiProperty } from '@nestjs/swagger';

export class ApiUnauthorizedResponseDto {
  @ApiProperty({
    description: 'Error status code',
    default: 401,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error status code',
    default: 'Unauthorized',
  })
  message: string;
}
