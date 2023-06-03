import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
  @ApiProperty({ description: 'Access token for user' })
  accessToken: string;
  @ApiProperty({ description: 'Refresh token for user' })
  refreshToken: string;
}
