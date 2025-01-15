import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ManualJournalsApplication } from './ManualJournalsApplication.service';
import { IManualJournalDTO } from './types/ManualJournals.types';
import { PublicRoute } from '../Auth/Jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('manual-journals')
@ApiTags('manual-journals')
@PublicRoute()
export class ManualJournalsController {
  constructor(private manualJournalsApplication: ManualJournalsApplication) {}

  @Post()
  @ApiOperation({ summary: 'Create a new manual journal.' })
  public createManualJournal(@Body() manualJournalDTO: IManualJournalDTO) {
    return this.manualJournalsApplication.createManualJournal(manualJournalDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given manual journal.' })
  @ApiResponse({
    status: 200,
    description: 'The manual journal has been successfully edited.',
  })
  @ApiResponse({ status: 404, description: 'The manual journal not found.' })
  public editManualJournal(
    @Param('id') manualJournalId: number,
    @Body() manualJournalDTO: IManualJournalDTO,
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
  public deleteManualJournal(@Param('id') manualJournalId: number) {
    return this.manualJournalsApplication.deleteManualJournal(manualJournalId);
  }

  @Put(':id/publish')
  @ApiOperation({ summary: 'Publish the given manual journal.' })
  @ApiResponse({
    status: 200,
    description: 'The manual journal has been successfully published.',
  })
  @ApiResponse({ status: 404, description: 'The manual journal not found.' })
  public publishManualJournal(@Param('id') manualJournalId: number) {
    return this.manualJournalsApplication.publishManualJournal(manualJournalId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the manual journal details.' })
  @ApiResponse({
    status: 200,
    description: 'The manual journal details have been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'The manual journal not found.' })
  public getManualJournal(@Param('id') manualJournalId: number) {
    return this.manualJournalsApplication.getManualJournal(manualJournalId);
  }
}
