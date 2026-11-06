import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { ServiceError } from '@/modules/Items/ServiceError';
import { AutoIncrementOrdersService } from '@/modules/AutoIncrementOrders/AutoIncrementOrders.service';
import { CommandManualJournalValidators } from '@/modules/ManualJournals/commands/CommandManualJournalValidators.service';
import { CommandTrackingCategoryValidator } from '@/modules/TrackingCategories/commands/CommandTrackingCategoryValidator.service';
import { CreateManualJournalDto } from '@/modules/ManualJournals/dtos/ManualJournal.dto';
import { RecurringJournal } from '../models/RecurringJournal';
import { ERRORS, RecurringJournalStatus } from '../RecurringJournal.types';
import { RECURRENCE_DATE_FORMAT } from '@/utils/recurrence';

@Injectable()
export class RecurringJournalValidators {
  constructor(
    private readonly autoIncrementOrders: AutoIncrementOrdersService,
    private readonly manualJournalValidators: CommandManualJournalValidators,
    private readonly trackingCategoriesValidator: CommandTrackingCategoryValidator,
  ) {}

  /**
   * Validates that the end date is not before the start date.
   */
  public validateDateRange(startDate: string, endDate?: string | null): void {
    if (!startDate) {
      throw new ServiceError(ERRORS.RECURRING_JOURNAL_START_DATE_REQUIRED);
    }
    if (endDate && moment(endDate).isBefore(moment(startDate), 'day')) {
      throw new ServiceError(ERRORS.RECURRING_JOURNAL_END_DATE_INVALID);
    }
  }

  /**
   * Validates the profile name.
   */
  public validateProfileName(profileName?: string): void {
    if (!profileName || !profileName.trim()) {
      throw new ServiceError(ERRORS.RECURRING_JOURNAL_PROFILE_NAME_REQUIRED);
    }
  }

  /**
   * Recurring journals are generated in the background, so they need the
   * manual journal auto-increment setting to assign journal numbers.
   */
  public async validateAutoIncrement(): Promise<void> {
    const isAutoIncrement =
      await this.autoIncrementOrders.autoIncrementEnabled('manual_journals');

    if (!isAutoIncrement) {
      throw new ServiceError(
        ERRORS.RECURRING_JOURNAL_AUTO_INCREMENT_REQUIRED,
        'Recurring journals require auto-increment journal numbers. Enable auto-increment in the manual journal settings first.',
      );
    }
  }

  /**
   * Validates the recurring journal entries using the manual journal rules.
   */
  public async validateEntries(
    recurringJournalDTO: {
      entries: CreateManualJournalDto['entries'];
      currencyCode?: string;
    },
    baseCurrency: string,
  ): Promise<void> {
    const validationDTO = {
      entries: recurringJournalDTO.entries,
      currencyCode: recurringJournalDTO.currencyCode,
    } as CreateManualJournalDto;

    this.manualJournalValidators.valdiateCreditDebitTotalEquals(validationDTO);
    await this.manualJournalValidators.validateContactsExistance(validationDTO);
    await this.manualJournalValidators.validateAccountsExistance(validationDTO);
    await this.manualJournalValidators.dynamicValidateAccountsWithContactType(
      recurringJournalDTO.entries,
    );
    await this.manualJournalValidators.validateJournalCurrencyWithAccountsCurrency(
      validationDTO,
      baseCurrency,
    );
    await this.trackingCategoriesValidator.validateEntries(
      recurringJournalDTO.entries,
    );
  }

  /**
   * Validates that the profile can be paused.
   */
  public validateCanPause(recurringJournal: RecurringJournal): void {
    if (recurringJournal.status === RecurringJournalStatus.Completed) {
      throw new ServiceError(ERRORS.RECURRING_JOURNAL_ALREADY_COMPLETED);
    }
    if (recurringJournal.status === RecurringJournalStatus.Paused) {
      throw new ServiceError(ERRORS.RECURRING_JOURNAL_ALREADY_PAUSED);
    }
  }

  /**
   * Validates that the profile can be resumed.
   */
  public validateCanResume(recurringJournal: RecurringJournal): void {
    if (recurringJournal.status === RecurringJournalStatus.Completed) {
      throw new ServiceError(ERRORS.RECURRING_JOURNAL_ALREADY_COMPLETED);
    }
    if (recurringJournal.status !== RecurringJournalStatus.Paused) {
      throw new ServiceError(ERRORS.RECURRING_JOURNAL_NOT_PAUSED);
    }
  }

  /**
   * Formats a date string to the recurrence format.
   */
  public formatDate(date: string | Date): string {
    return moment(date).format(RECURRENCE_DATE_FORMAT);
  }
}
