import { ApiProperty } from '@nestjs/swagger';

export class ContactResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'customer', enum: ['customer', 'vendor'] })
  contactService: string;

  @ApiProperty({ example: 'customer', enum: ['customer', 'vendor'] })
  contactType: string;

  @ApiProperty({ example: 'John Doe' })
  displayName: string;

  @ApiProperty({ example: 250.5 })
  balance: number;

  @ApiProperty({ example: 'USD' })
  currencyCode: string;

  @ApiProperty({ example: 250.5, required: false, nullable: true })
  openingBalance?: number | null;

  @ApiProperty({
    example: '2024-01-15T00:00:00Z',
    required: false,
    nullable: true,
  })
  openingBalanceAt?: Date | null;

  @ApiProperty({ example: 'Mr.', required: false, nullable: true })
  salutation?: string | null;

  @ApiProperty({ example: 'John', required: false, nullable: true })
  firstName?: string | null;

  @ApiProperty({ example: 'Doe', required: false, nullable: true })
  lastName?: string | null;

  @ApiProperty({ example: 'Acme Inc.', required: false, nullable: true })
  companyName?: string | null;

  @ApiProperty({ example: 'john@acme.com', required: false, nullable: true })
  email?: string | null;

  @ApiProperty({ example: '+1 555 0100', required: false, nullable: true })
  workPhone?: string | null;

  @ApiProperty({ example: '+1 555 0101', required: false, nullable: true })
  personalPhone?: string | null;

  @ApiProperty({ example: 'https://acme.com', required: false, nullable: true })
  website?: string | null;

  @ApiProperty({ required: false, nullable: true })
  billingAddress1?: string | null;

  @ApiProperty({ required: false, nullable: true })
  billingAddress2?: string | null;

  @ApiProperty({ required: false, nullable: true })
  billingAddressCity?: string | null;

  @ApiProperty({ required: false, nullable: true })
  billingAddressCountry?: string | null;

  @ApiProperty({ required: false, nullable: true })
  billingAddressEmail?: string | null;

  @ApiProperty({ required: false, nullable: true })
  billingAddressPostcode?: string | null;

  @ApiProperty({ required: false, nullable: true })
  billingAddressPhone?: string | null;

  @ApiProperty({ required: false, nullable: true })
  billingAddressState?: string | null;

  @ApiProperty({ required: false, nullable: true })
  shippingAddress1?: string | null;

  @ApiProperty({ required: false, nullable: true })
  shippingAddress2?: string | null;

  @ApiProperty({ required: false, nullable: true })
  shippingAddressCity?: string | null;

  @ApiProperty({ required: false, nullable: true })
  shippingAddressCountry?: string | null;

  @ApiProperty({ required: false, nullable: true })
  shippingAddressEmail?: string | null;

  @ApiProperty({ required: false, nullable: true })
  shippingAddressPostcode?: string | null;

  @ApiProperty({ required: false, nullable: true })
  shippingAddressPhone?: string | null;

  @ApiProperty({ required: false, nullable: true })
  shippingAddressState?: string | null;

  @ApiProperty({ example: 'Internal note', required: false, nullable: true })
  note?: string | null;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: 'Customer', required: false })
  formattedContactService?: string;

  @ApiProperty({ example: 'debit', required: false, nullable: true })
  contactNormal?: string | null;

  @ApiProperty({ example: 250.5, required: false })
  closingBalance?: number;

  @ApiProperty({ example: '$250.50', required: false })
  formattedBalance?: string;

  @ApiProperty({ example: '$250.50', required: false })
  formattedOpeningBalance?: string;

  @ApiProperty({ example: '2024-01-15', required: false })
  formattedOpeningBalanceAt?: string;

  @ApiProperty({ example: '2024-01-15T00:00:00Z', required: false })
  createdAt?: Date;

  @ApiProperty({ example: '2024-01-15T00:00:00Z', required: false })
  updatedAt?: Date;
}
