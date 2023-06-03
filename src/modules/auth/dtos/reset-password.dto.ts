import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { MatchPasswords } from '@decorators/password-match.decorator';

export class ResetPasswordBodyDto {
  @ApiProperty({
    description: 'New password of user',
    example: 'Password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Password matching to new password.',
    example: 'New-Password',
  })
  @IsString()
  @IsNotEmpty()
  @Validate(MatchPasswords, ['password'])
  confirmPassword: string;
}
