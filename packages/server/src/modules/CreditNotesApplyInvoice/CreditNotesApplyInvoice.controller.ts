import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { GetCreditNoteAssociatedAppliedInvoices } from './queries/GetCreditNoteAssociatedAppliedInvoices.service';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { CreditNoteAction } from '../CreditNotes/types/CreditNotes.types';
import { GetCreditNoteAssociatedInvoicesToApply } from './queries/GetCreditNoteAssociatedInvoicesToApply.service';
import { CreditNoteApplyToInvoices } from './commands/CreditNoteApplyToInvoices.service';
import { DeleteCreditNoteApplyToInvoices } from './commands/DeleteCreditNoteApplyToInvoices.service';
import { ApplyCreditNoteToInvoicesDto } from './dtos/ApplyCreditNoteToInvoices.dto';
import { AppliedCreditNoteInvoiceResponseDto } from './dtos/AppliedCreditNoteInvoiceResponse.dto';
import { CreditNoteInvoiceToApplyResponseDto } from './dtos/CreditNoteInvoiceToApplyResponse.dto';

@Controller('credit-notes')
@ApiTags('Credit Notes Apply Invoice')
@ApiExtraModels(
  AppliedCreditNoteInvoiceResponseDto,
  CreditNoteInvoiceToApplyResponseDto,
)
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class CreditNotesApplyInvoiceController {
  constructor(
    private readonly getCreditNoteAssociatedAppliedInvoicesService: GetCreditNoteAssociatedAppliedInvoices,
    private readonly getCreditNoteAssociatedInvoicesToApplyService: GetCreditNoteAssociatedInvoicesToApply,
    private readonly creditNoteApplyToInvoicesService: CreditNoteApplyToInvoices,
    private readonly deleteCreditNoteApplyToInvoicesService: DeleteCreditNoteApplyToInvoices,
  ) {}

  @Get(':creditNoteId/applied-invoices')
  @RequirePermission(CreditNoteAction.View, AbilitySubject.CreditNote)
  @ApiOperation({ summary: 'Applied credit note to invoices' })
  @ApiResponse({
    status: 200,
    description: 'Credit note successfully applied to invoices',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(AppliedCreditNoteInvoiceResponseDto) },
    },
  })
  @ApiResponse({ status: 404, description: 'Credit note not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  appliedCreditNoteToInvoices(@Param('creditNoteId') creditNoteId: number) {
    return this.getCreditNoteAssociatedAppliedInvoicesService.getCreditAssociatedAppliedInvoices(
      creditNoteId,
    );
  }

  @Get(':creditNoteId/apply-invoices')
  @RequirePermission(CreditNoteAction.View, AbilitySubject.CreditNote)
  @ApiOperation({ summary: 'Get credit note associated invoices to apply' })
  @ApiResponse({
    status: 200,
    description: 'Credit note associated invoices to apply',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(CreditNoteInvoiceToApplyResponseDto) },
    },
  })
  @ApiResponse({ status: 404, description: 'Credit note not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  getCreditNoteAssociatedInvoicesToApply(
    @Param('creditNoteId') creditNoteId: number,
  ) {
    return this.getCreditNoteAssociatedInvoicesToApplyService.getCreditAssociatedInvoicesToApply(
      creditNoteId,
    );
  }

  @Post(':creditNoteId/apply-invoices')
  @RequirePermission(CreditNoteAction.Edit, AbilitySubject.CreditNote)
  @ApiOperation({ summary: 'Apply credit note to invoices' })
  @ApiResponse({
    status: 200,
    description: 'Credit note successfully applied to invoices',
  })
  @ApiResponse({ status: 404, description: 'Credit note not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  applyCreditNoteToInvoices(
    @Param('creditNoteId') creditNoteId: number,
    @Body() applyDto: ApplyCreditNoteToInvoicesDto,
  ) {
    return this.creditNoteApplyToInvoicesService.applyCreditNoteToInvoices(
      creditNoteId,
      applyDto,
    );
  }

  @Delete('applied-invoices/:applyCreditToInvoicesId')
  @RequirePermission(CreditNoteAction.Edit, AbilitySubject.CreditNote)
  @ApiOperation({ summary: 'Delete applied credit note to invoice' })
  @ApiResponse({
    status: 200,
    description: 'Credit note application successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Credit note application not found',
  })
  deleteApplyCreditNoteToInvoices(
    @Param('applyCreditToInvoicesId') applyCreditToInvoicesId: number,
  ) {
    return this.deleteCreditNoteApplyToInvoicesService.deleteApplyCreditNoteToInvoices(
      applyCreditToInvoicesId,
    );
  }
}
