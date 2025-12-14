import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AttachmentLinkDto } from '@/modules/Attachments/dtos/Attachment.dto';
import { AccountResponseDto } from '@/modules/Accounts/dtos/AccountResponse.dto';
import { BranchResponseDto } from '@/modules/Branches/dtos/BranchResponse.dto';

class PaymentReceivedEntryResponseDto {
  @ApiProperty({ description: 'ID of the entry', example: 1 })
  id: number;

  @ApiProperty({ description: 'Index of the entry', example: 0 })
  index: number;

  @ApiProperty({ description: 'ID of the payment received', example: 1 })
  paymentReceiveId: number;

  @ApiProperty({ description: 'ID of the invoice', example: 10 })
  invoiceId: number;

  @ApiProperty({ description: 'Amount paid for this invoice', example: 100 })
  paymentAmount: number;

  @ApiProperty({ description: 'Formatted paid amount', example: '100.00' })
  paymentAmountFormatted: string;

  @ApiProperty({
    description: 'Invoice details',
    example: {
      id: 10,
      invoiceNo: 'INV-001',
      total: 1000,
      dueAmount: 500,
      customerId: 1,
    },
  })
  invoice: any; // Use a minimal inline object or import a minimal DTO if available
}

export class PaymentReceivedResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the payment received',
    example: 1,
  })
  id: number;

  @ApiProperty({ description: 'The payment receive number', example: 'PR-001' })
  paymentReceiveNo: string;

  @ApiProperty({
    description: 'The date of the payment',
    example: '2023-01-01T00:00:00Z',
  })
  paymentDate: Date | string;

  @ApiProperty({
    description: 'The formatted payment date',
    example: '2023-01-01',
  })
  formattedPaymentDate: string;

  @ApiProperty({ description: 'The customer ID', example: 1 })
  customerId: number;

  @ApiProperty({
    description: 'The reference number',
    example: 'REF-001',
    required: false,
  })
  referenceNo?: string;

  @ApiProperty({ description: 'The amount received', example: 100 })
  amount: number;

  @ApiProperty({ description: 'The formatted amount', example: '100.00' })
  formattedAmount: string;

  @ApiProperty({ description: 'The formatted total', example: '100.00 USD' })
  formattedTotal: string;

  @ApiProperty({ description: 'The currency code', example: 'USD' })
  currencyCode: string;

  @ApiProperty({ description: 'The exchange rate', example: 1.0 })
  exchangeRate: number;

  @ApiProperty({ description: 'The formatted exchange rate', example: '1.00' })
  formattedExchangeRate: string;

  @ApiProperty({
    description: 'The statement or note',
    example: 'Payment for invoice INV-001',
    required: false,
  })
  statement?: string;

  @ApiProperty({ description: 'The ID of the deposit account', example: 2 })
  depositAccountId: number;

  @ApiProperty({
    description: 'Deposit account details',
    type: () => AccountResponseDto,
  })
  @Type(() => AccountResponseDto)
  depositAccount: AccountResponseDto;

  @ApiProperty({
    description: 'The ID of the branch',
    example: 1,
    required: false,
  })
  branchId?: number;

  @ApiProperty({
    description: 'Branch details',
    type: () => BranchResponseDto,
    required: false,
  })
  @Type(() => BranchResponseDto)
  branch?: BranchResponseDto;

  @ApiProperty({
    description: 'The ID of the PDF template',
    example: 1,
    required: false,
  })
  pdfTemplateId?: number;

  @ApiProperty({
    description: 'PDF template details',
    required: false,
    example: {
      id: 1,
      templateName: 'Default',
      resource: 'PaymentReceive',
      attributes: { primaryColor: '#000000' },
    },
  })
  pdfTemplate?: {
    id: number;
    templateName: string;
    resource: string;
    attributes: Record<string, any>;
  };

  @ApiProperty({
    description: 'The user ID who created the payment',
    example: 5,
  })
  userId: number;

  @ApiProperty({
    description: 'The date when the payment was created',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date | string;

  @ApiProperty({
    description: 'The formatted created at date',
    example: '2023-01-01',
  })
  formattedCreatedAt: string;

  @ApiProperty({
    description: 'The date when the payment was last updated',
    example: '2023-01-02T00:00:00Z',
    required: false,
  })
  updatedAt?: Date | string;

  @ApiProperty({
    description: 'The entries of the payment received',
    type: [PaymentReceivedEntryResponseDto],
    example: [
      {
        id: 1,
        index: 0,
        paymentReceiveId: 1,
        invoiceId: 10,
        paymentAmount: 100,
        paymentAmountFormatted: '100.00',
        invoice: {
          id: 10,
          invoiceNo: 'INV-001',
          total: 1000,
          dueAmount: 500,
          customerId: 1,
        },
      },
    ],
  })
  @Type(() => PaymentReceivedEntryResponseDto)
  entries: PaymentReceivedEntryResponseDto[];

  @ApiProperty({
    description: 'The attachments of the payment received',
    type: [AttachmentLinkDto],
    required: false,
    example: [{ key: 'file-uuid-1' }, { key: 'file-uuid-2' }],
  })
  @Type(() => AttachmentLinkDto)
  attachments?: AttachmentLinkDto[];
}
