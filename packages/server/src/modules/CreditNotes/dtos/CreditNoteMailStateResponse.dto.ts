import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AddressItemDto {
  @ApiProperty()
  label: string;

  @ApiProperty()
  mail: string;

  @ApiPropertyOptional()
  primary?: boolean;
}

class CreditNoteEntryMailDto {
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

export class CreditNoteMailStateResponseDto {
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
  formatArgs?: Record<string, string>;

  @ApiProperty({ type: [AddressItemDto] })
  toOptions: AddressItemDto[];

  @ApiProperty({ type: [AddressItemDto] })
  fromOptions: AddressItemDto[];

  @ApiPropertyOptional()
  attachPdf?: boolean;

  @ApiProperty()
  creditNoteDate: string;

  @ApiProperty()
  creditNoteDateFormatted: string;

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
  creditNoteNumber: string;

  @ApiProperty({ type: [CreditNoteEntryMailDto] })
  entries: CreditNoteEntryMailDto[];

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  companyLogoUri: string | null;

  @ApiProperty()
  primaryColor: string | null;

  @ApiProperty()
  customerName: string;
}
