import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ICreditNoteRefundDTO } from '../CreditNotes/types/CreditNotes.types';
import { CreditNotesRefundsApplication } from './CreditNotesRefundsApplication.service';
import { RefundCreditNote } from './models/RefundCreditNote';
import { CreditNoteRefundDto } from './dto/CreditNoteRefund.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { CreditNoteAction } from '../CreditNotes/types/CreditNotes.types';
import { RefundCreditNoteResponseDto } from './dto/RefundCreditNoteResponse.dto';

@Controller('credit-notes')
@ApiTags('Credit Note Refunds')
@ApiExtraModels(RefundCreditNoteResponseDto)
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class CreditNoteRefundsController {
  constructor(
    private readonly creditNotesRefundsApplication: CreditNotesRefundsApplication,
  ) {}

  @Get(':creditNoteId/refunds')
  @RequirePermission(CreditNoteAction.View, AbilitySubject.CreditNote)
  @ApiOperation({ summary: 'Retrieve the credit note graph.' })
  @ApiResponse({
    status: 200,
    description: 'Credit note refunds retrieved successfully.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(RefundCreditNoteResponseDto) },
    },
  })
  getCreditNoteRefunds(@Param('creditNoteId') creditNoteId: number) {
    return this.creditNotesRefundsApplication.getCreditNoteRefunds(
      creditNoteId,
    );
  }

  @Get('refunds/:refundCreditId')
  @RequirePermission(CreditNoteAction.View, AbilitySubject.CreditNote)
  @ApiOperation({
    summary: 'Retrieve a refund transaction for the given credit note.',
  })
  @ApiResponse({
    status: 200,
    description: 'Refund credit note transaction retrieved successfully.',
    schema: {
      $ref: getSchemaPath(RefundCreditNoteResponseDto),
    },
  })
  getRefundCreditNoteTransaction(
    @Param('refundCreditId') refundCreditId: number,
  ) {
    return this.creditNotesRefundsApplication.getRefundCreditNoteTransaction(
      refundCreditId,
    );
  }

  /**
   * Create a refund credit note.
   * @param {number} creditNoteId - The credit note ID.
   * @param {ICreditNoteRefundDTO} creditNoteDTO - The credit note DTO.
   * @returns {Promise<RefundCreditNote>}
   */
  @Post(':creditNoteId/refunds')
  @RequirePermission(CreditNoteAction.Refund, AbilitySubject.CreditNote)
  @ApiOperation({ summary: 'Create a refund for the given credit note.' })
  createRefundCreditNote(
    @Param('creditNoteId') creditNoteId: number,
    @Body() creditNoteDTO: CreditNoteRefundDto,
  ): Promise<RefundCreditNote> {
    return this.creditNotesRefundsApplication.createRefundCreditNote(
      creditNoteId,
      creditNoteDTO,
    );
  }

  /**
   * Delete a refund credit note.
   * @param {number} refundCreditId - The refund credit ID.
   * @returns {Promise<void>}
   */
  @Delete('refunds/:refundCreditId')
  @RequirePermission(CreditNoteAction.Refund, AbilitySubject.CreditNote)
  @ApiOperation({ summary: 'Delete a refund for the given credit note.' })
  deleteRefundCreditNote(
    @Param('refundCreditId') refundCreditId: number,
  ): Promise<void> {
    return this.creditNotesRefundsApplication.deleteRefundCreditNote(
      refundCreditId,
    );
  }
}
