import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels()
export class InviteUserDto {
  @ApiProperty({
    description: 'First name of the user to invite',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user to invite',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Password for the invited user',
    example: 'StrongPassword123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

@ApiExtraModels()
export class SendInviteUserDto {
  @ApiProperty({
    description: 'Email address of the user to invite',
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Role ID to assign to the invited user',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  roleId: number;
}
