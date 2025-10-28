import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CustomerResponseDto {
  @ApiProperty({ example: 1500.0 })
  balance: number;

  @ApiProperty({ example: 'USD' })
  currencyCode: string;

  @ApiProperty({ example: 1000.0 })
  openingBalance: number;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @Type(() => Date)
  openingBalanceAt: Date;

  @ApiProperty({ example: 1.0 })
  openingBalanceExchangeRate: number;

  @ApiProperty({ required: false, example: 1 })
  openingBalanceBranchId?: number;

  @ApiProperty({ required: false, example: 'Mr.' })
  salutation?: string;

  @ApiProperty({ required: false, example: 'John' })
  firstName?: string;

  @ApiProperty({ required: false, example: 'Doe' })
  lastName?: string;

  @ApiProperty({ required: false, example: 'Acme Corporation' })
  companyName?: string;

  @ApiProperty({ example: 'John Doe - Acme Corporation' })
  displayName: string;

  @ApiProperty({ required: false, example: 'john.doe@acme.com' })
  email?: string;

  @ApiProperty({ required: false, example: '+1 (555) 123-4567' })
  workPhone?: string;

  @ApiProperty({ required: false, example: '+1 (555) 987-6543' })
  personalPhone?: string;

  @ApiProperty({ required: false, example: 'https://www.acme.com' })
  website?: string;

  @ApiProperty({ required: false, example: '123 Business Ave' })
  billingAddress1?: string;

  @ApiProperty({ required: false, example: 'Suite 100' })
  billingAddress2?: string;

  @ApiProperty({ required: false, example: 'New York' })
  billingAddressCity?: string;

  @ApiProperty({ required: false, example: 'United States' })
  billingAddressCountry?: string;

  @ApiProperty({ required: false, example: 'billing@acme.com' })
  billingAddressEmail?: string;

  @ApiProperty({ required: false, example: '10001' })
  billingAddressPostcode?: string;

  @ApiProperty({ required: false, example: '+1 (555) 111-2222' })
  billingAddressPhone?: string;

  @ApiProperty({ required: false, example: 'NY' })
  billingAddressState?: string;

  @ApiProperty({ required: false, example: '456 Shipping St' })
  shippingAddress1?: string;

  @ApiProperty({ required: false, example: 'Unit 200' })
  shippingAddress2?: string;

  @ApiProperty({ required: false, example: 'Los Angeles' })
  shippingAddressCity?: string;

  @ApiProperty({ required: false, example: 'United States' })
  shippingAddressCountry?: string;

  @ApiProperty({ required: false, example: 'shipping@acme.com' })
  shippingAddressEmail?: string;

  @ApiProperty({ required: false, example: '90001' })
  shippingAddressPostcode?: string;

  @ApiProperty({ required: false, example: '+1 (555) 333-4444' })
  shippingAddressPhone?: string;

  @ApiProperty({ required: false, example: 'CA' })
  shippingAddressState?: string;

  @ApiProperty({ example: 'Important client with regular monthly orders' })
  note: string;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00Z' })
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({ example: 1000.0 })
  localOpeningBalance: number;

  @ApiProperty({ example: 1500.0 })
  closingBalance: number;
}
