import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class GenerateSaleInvoiceSharableLinkDto {
  @IsOptional()
  @IsIn(['public', 'private'])
  @ApiPropertyOptional({
    description: 'Determines whether the link is accessible by anyone.',
    enum: ['public', 'private'],
    default: 'private',
  })
  publicity?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'The date the shared link expires at the end of the day.',
    example: '2026-11-07',
  })
  expiryTime?: string;
}
