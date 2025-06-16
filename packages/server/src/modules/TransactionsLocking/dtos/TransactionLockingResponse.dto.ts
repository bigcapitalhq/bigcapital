import { ApiProperty } from '@nestjs/swagger';

export class TransactionLockingResponseDto {
  @ApiProperty({
    description: 'Indicates whether transaction locking is enabled',
    example: true,
  })
  isEnabled: boolean;

  @ApiProperty({
    description: 'Indicates whether partial unlock is enabled',
    example: false,
  })
  isPartialUnlock: boolean;

  @ApiProperty({
    description: 'The date until which transactions are locked',
    example: '2024-12-31',
  })
  lockToDate: Date;

  @ApiProperty({
    description: 'The start date of the unlock period',
    example: '2025-01-01',
  })
  unlockFromDate: string;

  @ApiProperty({
    description: 'The end date of the unlock period',
    example: '2025-01-31',
  })
  unlockToDate: string;

  @ApiProperty({
    description: 'The reason for locking transactions',
    example: 'Year-end closing',
  })
  lockReason: string;

  @ApiProperty({
    description: 'The reason for unlocking transactions',
    example: 'New fiscal year',
  })
  unlockReason: string;

  @ApiProperty({
    description: 'The reason for partial unlock of transactions',
    example: 'Special adjustment period',
  })
  partialUnlockReason: string;
}
