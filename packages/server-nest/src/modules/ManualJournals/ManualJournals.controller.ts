import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ManualJournalsApplication } from './ManualJournalsApplication.service';
import { IManualJournalDTO } from './types/ManualJournals.types';
import { PublicRoute } from '../Auth/Jwt.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
  public deleteManualJournal(@Param('id') manualJournalId: number) {
    return this.manualJournalsApplication.deleteManualJournal(manualJournalId);
  }

  @Put(':id/publish')
  @ApiOperation({ summary: 'Publish the given manual journal.' })
  @HttpCode(HttpStatus.OK)
  public publishManualJournal(@Param('id') manualJournalId: number) {
    return this.manualJournalsApplication.publishManualJournal(manualJournalId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the manual journal details.' })
  public getManualJournal(@Param('id') manualJournalId: number) {
    return this.manualJournalsApplication.getManualJournal(manualJournalId);
  }
}
