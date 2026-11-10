import { Injectable } from '@nestjs/common';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { CreateRecurringInvoice } from './commands/CreateRecurringInvoice.service';
import { EditRecurringInvoice } from './commands/EditRecurringInvoice.service';
import { DeleteRecurringInvoice } from './commands/DeleteRecurringInvoice.service';
import { PauseRecurringInvoice } from './commands/PauseRecurringInvoice.service';
import { ResumeRecurringInvoice } from './commands/ResumeRecurringInvoice.service';
import { GenerateRecurringInvoice } from './commands/GenerateRecurringInvoice.service';
import { GetRecurringInvoices } from './queries/GetRecurringInvoices.service';
import { GetRecurringInvoice } from './queries/GetRecurringInvoice.service';
import { GetRecurringInvoiceInvoices } from './queries/GetRecurringInvoiceInvoices.service';
import { GetRecurringInvoiceState } from './queries/GetRecurringInvoiceState.service';
import { RecurringInvoicesQueue } from './services/RecurringInvoicesQueue.service';
import {
  CreateRecurringInvoiceDto,
  EditRecurringInvoiceDto,
} from './dtos/RecurringInvoice.dto';
import { GetRecurringInvoicesQueryDto } from './dtos/GetRecurringInvoicesQuery.dto';
import { GetRecurringInvoiceInvoicesQueryDto } from './dtos/GetRecurringInvoiceInvoicesQuery.dto';

@Injectable()
export class RecurringInvoicesApplication {
  constructor(
    private readonly createRecurringInvoiceService: CreateRecurringInvoice,
    private readonly editRecurringInvoiceService: EditRecurringInvoice,
    private readonly deleteRecurringInvoiceService: DeleteRecurringInvoice,
    private readonly pauseRecurringInvoiceService: PauseRecurringInvoice,
    private readonly resumeRecurringInvoiceService: ResumeRecurringInvoice,
    private readonly generateRecurringInvoiceService: GenerateRecurringInvoice,
    private readonly getRecurringInvoicesService: GetRecurringInvoices,
    private readonly getRecurringInvoiceService: GetRecurringInvoice,
    private readonly getRecurringInvoiceInvoicesService: GetRecurringInvoiceInvoices,
    private readonly getRecurringInvoiceStateService: GetRecurringInvoiceState,
    private readonly recurringInvoicesQueue: RecurringInvoicesQueue,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Creates a recurring invoice profile and schedules an immediate run.
   */
  public async createRecurringInvoice(
    recurringInvoiceDTO: CreateRecurringInvoiceDto,
  ) {
    const recurringInvoice =
      await this.createRecurringInvoiceService.createRecurringInvoice(
        recurringInvoiceDTO,
      );

    await this.enqueueImmediateRun();
    return recurringInvoice;
  }

  /**
   * Edits a recurring invoice profile and schedules an immediate run.
   */
  public async editRecurringInvoice(
    recurringInvoiceId: number,
    recurringInvoiceDTO: EditRecurringInvoiceDto,
  ) {
    const recurringInvoice =
      await this.editRecurringInvoiceService.editRecurringInvoice(
        recurringInvoiceId,
        recurringInvoiceDTO,
      );

    await this.enqueueImmediateRun();
    return recurringInvoice;
  }

  public deleteRecurringInvoice(recurringInvoiceId: number) {
    return this.deleteRecurringInvoiceService.deleteRecurringInvoice(
      recurringInvoiceId,
    );
  }

  public pauseRecurringInvoice(recurringInvoiceId: number) {
    return this.pauseRecurringInvoiceService.pauseRecurringInvoice(
      recurringInvoiceId,
    );
  }

  public async resumeRecurringInvoice(recurringInvoiceId: number) {
    const recurringInvoice =
      await this.resumeRecurringInvoiceService.resumeRecurringInvoice(
        recurringInvoiceId,
      );

    await this.enqueueImmediateRun();
    return recurringInvoice;
  }

  public generateNow(recurringInvoiceId: number) {
    return this.generateRecurringInvoiceService.generateNow(recurringInvoiceId);
  }

  public getRecurringInvoices(filterDTO: GetRecurringInvoicesQueryDto) {
    return this.getRecurringInvoicesService.getRecurringInvoices(filterDTO);
  }

  public getRecurringInvoice(recurringInvoiceId: number) {
    return this.getRecurringInvoiceService.getRecurringInvoice(
      recurringInvoiceId,
    );
  }

  public getRecurringInvoiceInvoices(
    recurringInvoiceId: number,
    query: GetRecurringInvoiceInvoicesQueryDto,
  ) {
    return this.getRecurringInvoiceInvoicesService.getRecurringInvoiceInvoices(
      recurringInvoiceId,
      query,
    );
  }

  public getRecurringInvoiceState() {
    return this.getRecurringInvoiceStateService.getRecurringInvoiceState();
  }

  /**
   * Enqueues a tenant run so newly created/resumed profiles are processed
   * without waiting for the periodic scan.
   */
  private async enqueueImmediateRun(): Promise<void> {
    try {
      const payload = await this.tenancyContext.getTenantJobPayload();
      await this.recurringInvoicesQueue.enqueueTenant(payload);
    } catch (_error) {
      // The periodic scan will pick the profile up if the queue is
      // temporarily unavailable.
    }
  }
}
