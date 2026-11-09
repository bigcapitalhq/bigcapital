import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreditNoteApplication } from './CreditNoteApplication.service';
import { CreateCreditNoteDto, EditCreditNoteDto } from './dtos/CreditNote.dto';
import { GetCreditNotesQueryDto } from './dtos/GetCreditNotesQuery.dto';
import { CreditNoteResponseDto } from './dtos/CreditNoteResponse.dto';
import { CreditNoteStateResponseDto } from './dtos/CreditNoteStateResponse.dto';
import { PaginatedResponseDto } from '@/common/dtos/PaginatedResults.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import {
  BulkDeleteDto,
  ValidateBulkDeleteResponseDto,
} from '@/common/dtos/BulkDelete.dto';
import { AcceptType } from '@/constants/accept-type';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import {
  CreditNoteAction,
  CreditNoteMailOptionsDTO,
} from './types/CreditNotes.types';
import { CreditNoteMailStateResponseDto } from './dtos/CreditNoteMailStateResponse.dto';
import { CreditNoteHtmlContentResponseDto } from './dtos/CreditNoteHtmlResponse.dto';

@Controller('credit-notes')
@ApiTags('Credit Notes')
@ApiExtraModels(CreditNoteResponseDto)
@ApiExtraModels(PaginatedResponseDto)
@ApiExtraModels(ValidateBulkDeleteResponseDto)
@ApiExtraModels(CreditNoteMailStateResponseDto)
@ApiExtraModels(CreditNoteHtmlContentResponseDto)
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class CreditNotesController {
  /**
   * @param {CreditNoteApplication} creditNoteApplication - The credit note application service.
   */
  constructor(private creditNoteApplication: CreditNoteApplication) {}

  @Post()
  @RequirePermission(CreditNoteAction.Create, AbilitySubject.CreditNote)
  @ApiOperation({ summary: 'Create a new credit note' })
  @ApiResponse({ status: 201, description: 'Credit note successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  createCreditNote(@Body() creditNoteDTO: CreateCreditNoteDto) {
    return this.creditNoteApplication.createCreditNote(creditNoteDTO);
  }

  @Get('state')
  @RequirePermission(CreditNoteAction.View, AbilitySubject.CreditNote)
  @ApiOperation({ summary: 'Get credit note state' })
  @ApiResponse({
    status: 200,
    description: 'Returns the credit note state',
    type: CreditNoteStateResponseDto,
  })
  getCreditNoteState() {
    return this.creditNoteApplication.getCreditNoteState();
  }

  /**
   * Sends the given credit note by mail.
   */
  @Post(':id/mail')
  @RequirePermission(CreditNoteAction.Edit, AbilitySubject.CreditNote)
  @ApiOperation({ summary: 'Send the given credit note by mail.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The credit note id',
  })
  @ApiResponse({
    status: 200,
    description: 'The credit note mail has been queued successfully.',
  })
  public sendCreditNoteMail(
    @Param('id') creditNoteId: number,
    @Body() mailOptions: CreditNoteMailOptionsDTO,
  ) {
    return this.creditNoteApplication.sendCreditNoteMail(
      creditNoteId,
      mailOptions,
    );
  }

  /**
   * Retrieves the credit note mail state.
   */
  @Get(':id/mail')
  @RequirePermission(CreditNoteAction.View, AbilitySubject.CreditNote)
  @ApiOperation({ summary: 'Retrieves the credit note mail state.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The credit note id',
  })
  @ApiResponse({
    status: 200,
    description: 'Retrieves the credit note mail state.',
    schema: { $ref: getSchemaPath(CreditNoteMailStateResponseDto) },
  })
  public getCreditNoteMail(@Param('id') creditNoteId: number) {
    return this.creditNoteApplication.getCreditNoteMailState(creditNoteId);
  }

  @Get(':id')
  @RequirePermission(CreditNoteAction.View, AbilitySubject.CreditNote)
  @ApiOperation({ summary: 'Get a specific credit note by ID' })
  @ApiParam({ name: 'id', description: 'Credit note ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Returns the credit note',
    content: {
      'application/json': {
        schema: {
          $ref: getSchemaPath(CreditNoteResponseDto),
        },
      },
      'application/json+html': {
        schema: {
          $ref: getSchemaPath(CreditNoteHtmlContentResponseDto),
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Credit note not found' })
  async getCreditNote(
    @Param('id') creditNoteId: number,
    @Headers('accept') acceptHeader: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accept = acceptHeader ?? '';

    if (accept.includes(AcceptType.ApplicationPdf)) {
      const [pdfContent, filename] =
        await this.creditNoteApplication.getCreditNotePdf(creditNoteId);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
        'Content-Disposition': `attachment; filename="${filename}"`,
      });
      res.status(200).send(pdfContent);
    } else if (accept.includes(AcceptType.ApplicationTextHtml)) {
      const htmlContent =
        await this.creditNoteApplication.getCreditNoteHtml(creditNoteId);
      return { htmlContent };
    } else {
      const creditNote =
        await this.creditNoteApplication.getCreditNote(creditNoteId);
      return creditNote;
    }
  }

  @Get()
  @RequirePermission(CreditNoteAction.View, AbilitySubject.CreditNote)
  @ApiOperation({ summary: 'Get all credit notes' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of credit notes',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(CreditNoteResponseDto) },
            },
          },
        },
      ],
    },
  })
  getCreditNotes(@Query() creditNotesQuery: GetCreditNotesQueryDto) {
    return this.creditNoteApplication.getCreditNotes(creditNotesQuery);
  }

  @Put(':id')
  @RequirePermission(CreditNoteAction.Edit, AbilitySubject.CreditNote)
  @ApiOperation({ summary: 'Update a credit note' })
  @ApiParam({ name: 'id', description: 'Credit note ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Credit note successfully updated' })
  @ApiResponse({ status: 404, description: 'Credit note not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  editCreditNote(
    @Param('id') creditNoteId: number,
    @Body() creditNoteDTO: EditCreditNoteDto,
  ) {
    return this.creditNoteApplication.editCreditNote(
      creditNoteId,
      creditNoteDTO,
    );
  }

  @Put(':id/open')
  @RequirePermission(CreditNoteAction.Edit, AbilitySubject.CreditNote)
  @ApiOperation({ summary: 'Open a credit note' })
  @ApiParam({ name: 'id', description: 'Credit note ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Credit note successfully opened' })
  @ApiResponse({ status: 404, description: 'Credit note not found' })
  openCreditNote(@Param('id') creditNoteId: number) {
    return this.creditNoteApplication.openCreditNote(creditNoteId);
  }

  @Post('validate-bulk-delete')
  @RequirePermission(CreditNoteAction.Delete, AbilitySubject.CreditNote)
  @ApiOperation({
    summary:
      'Validates which credit notes can be deleted and returns the results.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Validation completed with counts and IDs of deletable and non-deletable credit notes.',
    schema: {
      $ref: getSchemaPath(ValidateBulkDeleteResponseDto),
    },
  })
  validateBulkDeleteCreditNotes(
    @Body() bulkDeleteDto: BulkDeleteDto,
  ): Promise<ValidateBulkDeleteResponseDto> {
    return this.creditNoteApplication.validateBulkDeleteCreditNotes(
      bulkDeleteDto.ids,
    );
  }

  @Post('bulk-delete')
  @RequirePermission(CreditNoteAction.Delete, AbilitySubject.CreditNote)
  @ApiOperation({ summary: 'Deletes multiple credit notes.' })
  @ApiResponse({
    status: 200,
    description: 'Credit notes deleted successfully',
  })
  bulkDeleteCreditNotes(@Body() bulkDeleteDto: BulkDeleteDto): Promise<void> {
    return this.creditNoteApplication.bulkDeleteCreditNotes(bulkDeleteDto.ids, {
      skipUndeletable: bulkDeleteDto.skipUndeletable ?? false,
    });
  }

  @Delete(':id')
  @RequirePermission(CreditNoteAction.Delete, AbilitySubject.CreditNote)
  @ApiOperation({ summary: 'Delete a credit note' })
  @ApiParam({ name: 'id', description: 'Credit note ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Credit note successfully deleted' })
  @ApiResponse({ status: 404, description: 'Credit note not found' })
  deleteCreditNote(@Param('id') creditNoteId: number) {
    return this.creditNoteApplication.deleteCreditNote(creditNoteId);
  }
}
