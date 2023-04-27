import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { MatchPasswords } from 'src/decorators/password-match.decorator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Validate(MatchPasswords, ['newPassword'])
  confirmPassword: string;
}
