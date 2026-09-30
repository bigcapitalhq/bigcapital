import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ToNumber } from '@/common/decorators/Validators';

export class PlaidItemAccountLinkDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'BxBXxLj1m4HMXBm9WZZmCWVbPjX16EHwv99vp',
    description: 'The Plaid account id selected in Plaid Link',
  })
  plaidAccountId: string;

  @ToNumber()
  @IsInt()
  @ApiProperty({
    example: 1000,
    description: 'The existing bank or credit card account to link to',
  })
  accountId: number;
}
