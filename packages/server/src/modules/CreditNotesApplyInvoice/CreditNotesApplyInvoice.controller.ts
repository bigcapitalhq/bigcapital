import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCreditNoteAssociatedAppliedInvoices } from './queries/GetCreditNoteAssociatedAppliedInvoices.service';

@Controller('credit-notes')
@ApiTags('credit-notes-apply-invoice')
export class CreditNotesApplyInvoiceController {
  constructor(
    private readonly getCreditNoteAssociatedAppliedInvoicesService: GetCreditNoteAssociatedAppliedInvoices,
  ) {}

  @Get(':creditNoteId/applied-invoices')
  @ApiOperation({ summary: 'Applied credit note to invoices' })
  @ApiResponse({
    status: 200,
    description: 'Credit note successfully applied to invoices',
  })
  @ApiResponse({ status: 404, description: 'Credit note not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  appliedCreditNoteToInvoices(@Param('creditNoteId') creditNoteId: number) {
    return this.getCreditNoteAssociatedAppliedInvoicesService.getCreditAssociatedAppliedInvoices(
      creditNoteId,
    );
  }

  @Post(':creditNoteId/apply-invoices')
  @ApiOperation({ summary: 'Apply credit note to invoices' })
  @ApiResponse({
    status: 200,
    description: 'Credit note successfully applied to invoices',
  })
  @ApiResponse({ status: 404, description: 'Credit note not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  applyCreditNoteToInvoices(@Param('creditNoteId') creditNoteId: number) {
    return this.getCreditNoteAssociatedAppliedInvoicesService.getCreditAssociatedAppliedInvoices(
      creditNoteId,
    );
  }
}
