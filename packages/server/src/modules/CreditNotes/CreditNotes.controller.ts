import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreditNoteApplication } from './CreditNoteApplication.service';
import { ICreditNotesQueryDTO } from './types/CreditNotes.types';
import { CreateCreditNoteDto, EditCreditNoteDto } from './dtos/CreditNote.dto';

@Controller('credit-notes')
@ApiTags('credit-notes')
export class CreditNotesController {
  /**
   * @param {CreditNoteApplication} creditNoteApplication - The credit note application service.
   */
  constructor(private creditNoteApplication: CreditNoteApplication) {}

  @Post()
  @ApiOperation({ summary: 'Create a new credit note' })
  @ApiResponse({ status: 201, description: 'Credit note successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  createCreditNote(@Body() creditNoteDTO: CreateCreditNoteDto) {
    return this.creditNoteApplication.createCreditNote(creditNoteDTO);
  }

  @Get('state')
  @ApiOperation({ summary: 'Get credit note state' })
  @ApiResponse({ status: 200, description: 'Returns the credit note state' })
  getCreditNoteState() {
    return this.creditNoteApplication.getCreditNoteState();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific credit note by ID' })
  @ApiParam({ name: 'id', description: 'Credit note ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Returns the credit note' })
  @ApiResponse({ status: 404, description: 'Credit note not found' })
  getCreditNote(@Param('id') creditNoteId: number) {
    return this.creditNoteApplication.getCreditNote(creditNoteId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all credit notes' })
  @ApiResponse({ status: 200, description: 'Returns a list of credit notes' })
  getCreditNotes(@Query() creditNotesQuery: ICreditNotesQueryDTO) {
    return this.creditNoteApplication.getCreditNotes(creditNotesQuery);
  }

  @Put(':id')
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
  @ApiOperation({ summary: 'Open a credit note' })
  @ApiParam({ name: 'id', description: 'Credit note ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Credit note successfully opened' })
  @ApiResponse({ status: 404, description: 'Credit note not found' })
  openCreditNote(@Param('id') creditNoteId: number) {
    return this.creditNoteApplication.openCreditNote(creditNoteId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a credit note' })
  @ApiParam({ name: 'id', description: 'Credit note ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Credit note successfully deleted' })
  @ApiResponse({ status: 404, description: 'Credit note not found' })
  deleteCreditNote(@Param('id') creditNoteId: number) {
    return this.creditNoteApplication.deleteCreditNote(creditNoteId);
  }
}
