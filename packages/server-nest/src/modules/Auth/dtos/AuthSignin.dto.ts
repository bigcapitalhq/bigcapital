import { IsNotEmpty, IsString } from 'class-validator';

export class AuthSigninDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
