import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetContactsAutoCompleteQuery {
  @ApiPropertyOptional({
    description: 'Maximum number of contacts to return.',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  limit: number;

  @ApiPropertyOptional({
    description: 'Keyword to filter contacts by display name.',
    example: 'Acme',
  })
  @IsString()
  @IsOptional()
  keyword: string;
}
