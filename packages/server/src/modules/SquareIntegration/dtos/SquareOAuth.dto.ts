import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class SquareOAuthStartDto {
  @IsString()
  @IsIn(['sandbox', 'production'])
  @IsOptional()
  @ApiProperty({
    description:
      'Which Square environment to connect to. Defaults to the server-configured SQUARE_ENVIRONMENT.',
    example: 'sandbox',
    required: false,
  })
  environment?: 'sandbox' | 'production';
}

export class SquareOAuthCallbackDto {
  @IsString()
  @ApiProperty({
    description: 'Authorization code returned by Square.',
  })
  code: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description:
      'Opaque state token the caller supplied at /oauth/start; echoed to defeat CSRF.',
    required: false,
  })
  state?: string;
}
