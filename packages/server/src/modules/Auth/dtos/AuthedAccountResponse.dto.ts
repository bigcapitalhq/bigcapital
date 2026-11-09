import { ApiProperty } from '@nestjs/swagger';

export class AuthedAccountResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: number;

  @ApiProperty({ description: 'User first name' })
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  lastName: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'Whether the user account is active' })
  active: boolean;

  @ApiProperty({ description: 'User language', required: false })
  language?: string;

  @ApiProperty({ description: 'Tenant ID' })
  tenantId?: number;

  @ApiProperty({ description: 'Whether the user email is verified' })
  verified: boolean;
}
