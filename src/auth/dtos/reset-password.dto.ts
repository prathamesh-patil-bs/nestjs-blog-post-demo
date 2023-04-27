import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { MatchPasswords } from 'src/decorators/password-match.decorator';

export class ResetPasswordBodyDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Validate(MatchPasswords, ['password'])
  confirmPassword: string;
}
