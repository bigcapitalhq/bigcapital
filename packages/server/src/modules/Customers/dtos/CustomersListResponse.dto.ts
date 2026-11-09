import { ApiProperty } from '@nestjs/swagger';
import { CustomerResponseDto } from './CustomerResponse.dto';

class CustomersPaginationDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 12 })
  pageSize: number;

  @ApiProperty({ example: 42 })
  total: number;
}

export class CustomersListResponseDto {
  @ApiProperty({ type: [CustomerResponseDto] })
  data: CustomerResponseDto[];

  @ApiProperty({ type: CustomersPaginationDto })
  pagination: CustomersPaginationDto;
}
