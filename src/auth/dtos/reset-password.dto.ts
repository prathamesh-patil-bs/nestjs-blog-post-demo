import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { MatchPasswords } from 'src/decorators/password-match.decorator';

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
