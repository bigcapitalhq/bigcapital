import { ApiProperty } from '@nestjs/swagger';

export class ApiKeyResponseDto {
  @ApiProperty({ example: 1, description: 'API key ID' })
  id: number;

  @ApiProperty({
    example: 'bc_1234567890abcdef',
    description:
      'The API key string. Returned only once when the key is created.',
  })
  key: string;
}

export class ApiKeyRevokeResponseDto {
  @ApiProperty({ example: 1, description: 'API key ID' })
  id: number;

  @ApiProperty({
    example: true,
    description: 'Whether the API key was revoked',
  })
  revoked: boolean;
}

export class ApiKeyListItemDto {
  @ApiProperty({ example: 1, description: 'API key ID' })
  id: number;

  @ApiProperty({ example: 'My API Key', description: 'API key name' })
  name?: string;

  @ApiProperty({
    example: 'bc_1234...',
    description: 'Masked API key prefix',
  })
  token: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-12-31T23:59:59.000Z',
    required: false,
    description: 'Expiration date',
  })
  expiresAt?: Date;

  @ApiProperty({ example: false, description: 'Whether the key is revoked' })
  revoked: boolean;
}

export class ApiKeyListResponseDto {
  @ApiProperty({ type: [ApiKeyListItemDto] })
  data: ApiKeyListItemDto[];
}
