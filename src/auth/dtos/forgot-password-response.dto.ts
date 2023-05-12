import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordResponseDto {
  @ApiProperty({
    type: String,
    description: 'Password reset link',
    example: 'http://localhost:3000/api/reset-password/{id}/{token}',
  })
  passwordResetLink: string;
}
