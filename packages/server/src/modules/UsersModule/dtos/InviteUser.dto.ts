import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsValidPassword } from '@/modules/Auth/password.policy';

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
  @IsValidPassword()
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

@ApiExtraModels()
export class BulkInviteItemDto {
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

@ApiExtraModels()
export class BulkSendInviteUserDto {
  @ApiProperty({
    description: 'List of users to invite',
    type: [BulkInviteItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkInviteItemDto)
  invites: BulkInviteItemDto[];
}
