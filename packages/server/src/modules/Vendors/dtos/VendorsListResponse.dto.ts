import { ApiProperty } from '@nestjs/swagger';
import { VendorResponseDto } from './VendorResponse.dto';

class VendorsPaginationDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 12 })
  pageSize: number;

  @ApiProperty({ example: 42 })
  total: number;
}

export class VendorsListResponseDto {
  @ApiProperty({ type: [VendorResponseDto] })
  data: VendorResponseDto[];

  @ApiProperty({ type: VendorsPaginationDto })
  pagination: VendorsPaginationDto;
}
