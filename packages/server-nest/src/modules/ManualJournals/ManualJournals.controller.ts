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

@Controller('manual-journals')
@PublicRoute()
export class ManualJournalsController {
  constructor(private manualJournalsApplication: ManualJournalsApplication) {}

  @Post()
  public createManualJournal(@Body() manualJournalDTO: IManualJournalDTO) {
    return this.manualJournalsApplication.createManualJournal(manualJournalDTO);
  }

  @Put(':id')
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
  public deleteManualJournal(@Param('id') manualJournalId: number) {
    return this.manualJournalsApplication.deleteManualJournal(manualJournalId);
  }

  @Post(':id/publish')
  public publishManualJournal(@Param('id') manualJournalId: number) {
    return this.manualJournalsApplication.publishManualJournal(manualJournalId);
  }

  @Get(':id')
  public getManualJournal(@Param('id') manualJournalId: number) {
    return this.manualJournalsApplication.getManualJournal(manualJournalId);
  }
}
