import { Injectable } from '@nestjs/common';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { CreateRecurringJournal } from './commands/CreateRecurringJournal.service';
import { EditRecurringJournal } from './commands/EditRecurringJournal.service';
import { DeleteRecurringJournal } from './commands/DeleteRecurringJournal.service';
import { PauseRecurringJournal } from './commands/PauseRecurringJournal.service';
import { ResumeRecurringJournal } from './commands/ResumeRecurringJournal.service';
import { GenerateRecurringJournal } from './commands/GenerateRecurringJournal.service';
import { GetRecurringJournals } from './queries/GetRecurringJournals.service';
import { GetRecurringJournal } from './queries/GetRecurringJournal.service';
import { GetRecurringJournalJournals } from './queries/GetRecurringJournalJournals.service';
import { RecurringJournalsQueue } from './services/RecurringJournalsQueue.service';
import {
  CreateRecurringJournalDto,
  EditRecurringJournalDto,
} from './dtos/RecurringJournal.dto';
import { GetRecurringJournalsQueryDto } from './dtos/GetRecurringJournalsQuery.dto';
import { GetRecurringJournalJournalsQueryDto } from './dtos/GetRecurringJournalJournalsQuery.dto';

@Injectable()
export class RecurringJournalsApplication {
  constructor(
    private readonly createRecurringJournalService: CreateRecurringJournal,
    private readonly editRecurringJournalService: EditRecurringJournal,
    private readonly deleteRecurringJournalService: DeleteRecurringJournal,
    private readonly pauseRecurringJournalService: PauseRecurringJournal,
    private readonly resumeRecurringJournalService: ResumeRecurringJournal,
    private readonly generateRecurringJournalService: GenerateRecurringJournal,
    private readonly getRecurringJournalsService: GetRecurringJournals,
    private readonly getRecurringJournalService: GetRecurringJournal,
    private readonly getRecurringJournalJournalsService: GetRecurringJournalJournals,
    private readonly recurringJournalsQueue: RecurringJournalsQueue,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Creates a recurring journal profile and schedules an immediate run.
   */
  public async createRecurringJournal(
    recurringJournalDTO: CreateRecurringJournalDto,
  ) {
    const recurringJournal =
      await this.createRecurringJournalService.createRecurringJournal(
        recurringJournalDTO,
      );

    await this.enqueueImmediateRun();
    return recurringJournal;
  }

  /**
   * Edits a recurring journal profile and schedules an immediate run.
   */
  public async editRecurringJournal(
    recurringJournalId: number,
    recurringJournalDTO: EditRecurringJournalDto,
  ) {
    const recurringJournal =
      await this.editRecurringJournalService.editRecurringJournal(
        recurringJournalId,
        recurringJournalDTO,
      );

    await this.enqueueImmediateRun();
    return recurringJournal;
  }

  public deleteRecurringJournal(recurringJournalId: number) {
    return this.deleteRecurringJournalService.deleteRecurringJournal(
      recurringJournalId,
    );
  }

  public pauseRecurringJournal(recurringJournalId: number) {
    return this.pauseRecurringJournalService.pauseRecurringJournal(
      recurringJournalId,
    );
  }

  public async resumeRecurringJournal(recurringJournalId: number) {
    const recurringJournal =
      await this.resumeRecurringJournalService.resumeRecurringJournal(
        recurringJournalId,
      );

    await this.enqueueImmediateRun();
    return recurringJournal;
  }

  public generateNow(recurringJournalId: number) {
    return this.generateRecurringJournalService.generateNow(recurringJournalId);
  }

  public getRecurringJournals(filterDTO: GetRecurringJournalsQueryDto) {
    return this.getRecurringJournalsService.getRecurringJournals(filterDTO);
  }

  public getRecurringJournal(recurringJournalId: number) {
    return this.getRecurringJournalService.getRecurringJournal(
      recurringJournalId,
    );
  }

  public getRecurringJournalJournals(
    recurringJournalId: number,
    query: GetRecurringJournalJournalsQueryDto,
  ) {
    return this.getRecurringJournalJournalsService.getRecurringJournalJournals(
      recurringJournalId,
      query,
    );
  }

  /**
   * Enqueues a tenant run so newly created/resumed profiles are processed
   * without waiting for the periodic scan.
   */
  private async enqueueImmediateRun(): Promise<void> {
    try {
      const payload = await this.tenancyContext.getTenantJobPayload();
      await this.recurringJournalsQueue.enqueueTenant(payload);
    } catch (_error) {
      // The periodic scan will pick the profile up if the queue is
      // temporarily unavailable.
    }
  }
}
