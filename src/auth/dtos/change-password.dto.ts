import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { MatchPasswords } from 'src/decorators/password-match.decorator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Old password of user.',
    example: 'Old-Password',
  })
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'New password user want to set.',
    example: 'New-Password',
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Validate(MatchPasswords, ['newPassword'])
  @ApiProperty({
    description: 'New password matching to new password.',
    example: 'New-Password',
  })
  confirmPassword: string;
}
