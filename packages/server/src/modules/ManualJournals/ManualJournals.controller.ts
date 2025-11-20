import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ManualJournalsApplication } from './ManualJournalsApplication.service';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  CreateManualJournalDto,
  EditManualJournalDto,
} from './dtos/ManualJournal.dto';
import { IManualJournalsFilter } from './types/ManualJournals.types';
import { ManualJournalResponseDto } from './dtos/ManualJournalResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import {
  BulkDeleteDto,
  ValidateBulkDeleteResponseDto,
} from '@/common/dtos/BulkDelete.dto';

@Controller('manual-journals')
@ApiTags('Manual Journals')
@ApiExtraModels(ManualJournalResponseDto)
@ApiExtraModels(ValidateBulkDeleteResponseDto)
@ApiCommonHeaders()
export class ManualJournalsController {
  constructor(private manualJournalsApplication: ManualJournalsApplication) { }

  @Post('validate-bulk-delete')
  @ApiOperation({
    summary:
      'Validate which manual journals can be deleted and return the results.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Validation completed with counts and IDs of deletable and non-deletable manual journals.',
    schema: {
      $ref: getSchemaPath(ValidateBulkDeleteResponseDto),
    },
  })
  public validateBulkDeleteManualJournals(
    @Body() bulkDeleteDto: BulkDeleteDto,
  ): Promise<ValidateBulkDeleteResponseDto> {
    return this.manualJournalsApplication.validateBulkDeleteManualJournals(
      bulkDeleteDto.ids,
    );
  }

  @Post('bulk-delete')
  @ApiOperation({ summary: 'Deletes multiple manual journals.' })
  @ApiResponse({
    status: 200,
    description: 'Manual journals deleted successfully',
  })
  public bulkDeleteManualJournals(
    @Body() bulkDeleteDto: BulkDeleteDto,
  ): Promise<void> {
    return this.manualJournalsApplication.bulkDeleteManualJournals(
      bulkDeleteDto.ids,
      { skipUndeletable: bulkDeleteDto.skipUndeletable ?? false },
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new manual journal.' })
  @ApiResponse({
    status: 201,
    description: 'The manual journal has been successfully created.',
    schema: { $ref: getSchemaPath(ManualJournalResponseDto) },
  })
  public createManualJournal(@Body() manualJournalDTO: CreateManualJournalDto) {
    return this.manualJournalsApplication.createManualJournal(manualJournalDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given manual journal.' })
  @ApiResponse({
    status: 200,
    description: 'The manual journal has been successfully edited.',
    schema: { $ref: getSchemaPath(ManualJournalResponseDto) },
  })
  @ApiResponse({ status: 404, description: 'The manual journal not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The manual journal id',
  })
  public editManualJournal(
    @Param('id') manualJournalId: number,
    @Body() manualJournalDTO: EditManualJournalDto,
  ) {
    return this.manualJournalsApplication.editManualJournal(
      manualJournalId,
      manualJournalDTO,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given manual journal.' })
  @ApiResponse({
    status: 200,
    description: 'The manual journal has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'The manual journal not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The manual journal id',
  })
  public deleteManualJournal(@Param('id') manualJournalId: number) {
    return this.manualJournalsApplication.deleteManualJournal(manualJournalId);
  }

  @Patch(':id/publish')
  @ApiOperation({ summary: 'Publish the given manual journal.' })
  @ApiResponse({
    status: 200,
    description: 'The manual journal has been successfully published.',
    schema: {
      $ref: getSchemaPath(ManualJournalResponseDto),
    },
  })
  @ApiResponse({ status: 404, description: 'The manual journal not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The manual journal id',
  })
  public publishManualJournal(@Param('id') manualJournalId: number) {
    return this.manualJournalsApplication.publishManualJournal(manualJournalId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the manual journal details.' })
  @ApiResponse({
    status: 200,
    description: 'The manual journal details have been successfully retrieved.',
    schema: {
      $ref: getSchemaPath(ManualJournalResponseDto),
    },
  })
  @ApiResponse({ status: 404, description: 'The manual journal not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The manual journal id',
  })
  public getManualJournal(@Param('id') manualJournalId: number) {
    return this.manualJournalsApplication.getManualJournal(manualJournalId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the manual journals paginated list.' })
  @ApiResponse({
    status: 200,
    description: 'The manual journal details have been successfully retrieved.',
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(ManualJournalResponseDto),
      },
    },
  })
  @ApiResponse({ status: 404, description: 'The manual journal not found.' })
  public getManualJournals(@Query() filterDto: Partial<IManualJournalsFilter>) {
    return this.manualJournalsApplication.getManualJournals(filterDto);
  }
}
