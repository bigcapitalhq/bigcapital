import { ApiProperty } from '@nestjs/swagger';
import { ManualJournalResponseDto } from './ManualJournalResponse.dto';

class ManualJournalsPaginationDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 12 })
  pageSize: number;

  @ApiProperty({ example: 42 })
  total: number;
}

export class ManualJournalsListResponseDto {
  @ApiProperty({ type: [ManualJournalResponseDto] })
  data: ManualJournalResponseDto[];

  @ApiProperty({ type: ManualJournalsPaginationDto })
  pagination: ManualJournalsPaginationDto;
}
