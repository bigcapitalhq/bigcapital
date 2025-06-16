import { ApiProperty } from '@nestjs/swagger';

export class BranchResponseDto {
  @ApiProperty({
    description: 'Branch ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Branch name',
    example: 'Main Branch',
  })
  name: string;

  @ApiProperty({
    description: 'Branch code',
    example: 'BR001',
  })
  code: string;

  @ApiProperty({
    description: 'Branch address',
    example: '123 Main Street',
  })
  address: string;

  @ApiProperty({
    description: 'Branch city',
    example: 'New York',
  })
  city: string;

  @ApiProperty({
    description: 'Branch country',
    example: 'USA',
  })
  country: string;

  @ApiProperty({
    description: 'Branch phone number',
    example: '+1-555-123-4567',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Branch email',
    example: 'branch@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Branch website',
    example: 'https://www.example.com/branch',
  })
  website: string;

  @ApiProperty({
    description: 'Whether this is the primary branch',
    example: true,
  })
  primary: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-03-20T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-03-20T10:00:00Z',
  })
  updatedAt: Date;
}
