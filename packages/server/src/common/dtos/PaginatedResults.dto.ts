import { ApiProperty } from '@nestjs/swagger';

class Pagination {
  @ApiProperty({
    description: 'Total number of items across all pages',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number (1-based)',
    example: 1,
    minimum: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
  })
  pageSize: number;
}

export class PaginatedResponseDto<TData> {
  @ApiProperty({
    description: 'Pagination metadata',
    type: Pagination,
  })
  pagination: Pagination;

  data: TData[];
}
