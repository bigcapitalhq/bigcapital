import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ImportFileUploadResourceDto {
  @ApiProperty({ description: 'Unique import identifier' })
  importId: string;

  @ApiProperty({ description: 'Resource name (e.g. Customer, Bill)' })
  resource: string;
}

export class ImportFileUploadResourceColumnDto {
  @ApiProperty({ description: 'Resource column key' })
  key: string;

  @ApiProperty({ description: 'Resource column display name' })
  name: string;

  @ApiPropertyOptional({ description: 'Whether the column is required' })
  required?: boolean;

  @ApiPropertyOptional({ description: 'Column hint text' })
  hint?: string;
}

export class ImportFileUploadResponseDto {
  @ApiProperty({
    description: 'Created import identifier and resource',
    type: ImportFileUploadResourceDto,
  })
  import: ImportFileUploadResourceDto;

  @ApiProperty({
    description: 'Columns detected in the uploaded sheet',
    type: [String],
  })
  sheetColumns: string[];

  @ApiProperty({
    description: 'Columns defined by the target resource',
    type: [ImportFileUploadResourceColumnDto],
  })
  resourceColumns: ImportFileUploadResourceColumnDto[];
}
