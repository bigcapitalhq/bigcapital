import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AddressItemDto {
  @ApiProperty()
  label: string;

  @ApiProperty()
  mail: string;

  @ApiPropertyOptional()
  primary?: boolean;
}

class SaleEstimateEntryMailDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  unitPriceFormatted: string;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalFormatted: string;
}

export class SaleEstimateMailStateResponseDto {
  @ApiProperty({ type: [String] })
  from: string[];

  @ApiProperty({ type: [String] })
  to: string[];

  @ApiPropertyOptional({ type: [String] })
  cc?: string[];

  @ApiPropertyOptional({ type: [String] })
  bcc?: string[];

  @ApiProperty()
  subject: string;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  formatArgs?: { customerName: string; estimateAmount: string };

  @ApiProperty({ type: [AddressItemDto] })
  toOptions: AddressItemDto[];

  @ApiProperty({ type: [AddressItemDto] })
  fromOptions: AddressItemDto[];

  @ApiPropertyOptional()
  attachEstimate?: boolean;

  @ApiProperty()
  estimateDate: string;

  @ApiProperty()
  estimateDateFormatted: string;

  @ApiProperty()
  expirationDate: string;

  @ApiProperty()
  expirationDateFormatted: string;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalFormatted: string;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  subtotalFormatted: string;

  @ApiProperty()
  discountAmount: number;

  @ApiProperty()
  discountAmountFormatted: string;

  @ApiProperty()
  discountPercentage: number | null;

  @ApiProperty()
  discountPercentageFormatted: string;

  @ApiProperty()
  discountLabel: string;

  @ApiProperty()
  adjustment: number;

  @ApiProperty()
  adjustmentFormatted: string;

  @ApiProperty()
  estimateNumber: string;

  @ApiProperty({ type: [SaleEstimateEntryMailDto] })
  entries: SaleEstimateEntryMailDto[];

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  companyLogoUri: string | null;

  @ApiProperty()
  primaryColor: string | null;

  @ApiProperty()
  customerName: string;
}
