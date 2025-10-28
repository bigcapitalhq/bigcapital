import { IsEmail, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
export class EditUserDto {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Role ID assigned to the user',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  roleId: number;
}
