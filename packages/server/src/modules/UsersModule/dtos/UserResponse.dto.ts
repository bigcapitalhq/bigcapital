import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ description: 'The user ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'The first name', example: 'John' })
  firstName: string;

  @ApiProperty({ description: 'The last name', example: 'Doe' })
  lastName: string;

  @ApiProperty({
    description: 'The email address',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({ description: 'Whether the user is active', example: true })
  active: boolean;

  @ApiProperty({ description: 'The system user ID', example: 10 })
  systemUserId: number;

  @ApiProperty({ description: 'The role name', example: 'Administrator' })
  roleName: string;

  @ApiProperty({
    description: 'The role description',
    example: 'Full access to all features',
  })
  roleDescription: string;

  @ApiProperty({ description: 'The role slug', example: 'administrator' })
  roleSlug: string;
}
