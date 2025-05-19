import { IsEmail, IsNotEmpty } from 'class-validator';

export class EditUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  roleId: number;
}
