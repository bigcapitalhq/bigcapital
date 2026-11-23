import { Inject, Injectable } from '@nestjs/common';
import { uniq } from 'lodash';
import { ServiceError } from '@/modules/Items/ServiceError';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { AccountTransactionTrackingCategory } from '../models/AccountTransactionTrackingCategory';
import { ManualJournalEntryTrackingCategory } from '../models/ManualJournalEntryTrackingCategory';
import { TrackingCategory } from '../models/TrackingCategory';
import { TrackingCategoryOption } from '../models/TrackingCategoryOption';
import { ERRORS } from '../constants';
import { isTrackingCategoryAvailableForModule } from '../utils';
import {
  ITrackingCategoryEntry,
  TrackingCategoryModule,
} from '../types/TrackingCategory.types';

interface ITrackingCategoryOptionInput {
  id?: number;
  name: string;
  active?: boolean;
}

export interface IValidateTrackingCategoryEntriesOptions {
  allowInactive?: boolean;
  previousAssignments?: string[];
  previousCategoryIds?: number[];
  module?: TrackingCategoryModule;
}

@Injectable()
export class CommandTrackingCategoryValidator {
  constructor(
    @Inject(TrackingCategory.name)
    private readonly trackingCategoryModel: TenantModelProxy<
      typeof TrackingCategory
    >,
    @Inject(TrackingCategoryOption.name)
    private readonly trackingCategoryOptionModel: TenantModelProxy<
      typeof TrackingCategoryOption
    >,
    @Inject(ManualJournalEntryTrackingCategory.name)
    private readonly manualJournalEntryTrackingCategoryModel: TenantModelProxy<
      typeof ManualJournalEntryTrackingCategory
    >,
    @Inject(AccountTransactionTrackingCategory.name)
    private readonly accountTransactionTrackingCategoryModel: TenantModelProxy<
      typeof AccountTransactionTrackingCategory
    >,
  ) {}

  /**
   * Validates that the given category name is unique.
   * @param {string} name - Category name.
   * @param {number} [exceptCategoryId] - Category id to exclude.
   */
  public async validateNameUnique(
    name: string,
    exceptCategoryId?: number,
  ): Promise<void> {
    const category = await this.trackingCategoryModel()
      .query()
      .onBuild((query) => {
        query.findOne('name', name);

        if (exceptCategoryId) {
          query.whereNot('id', exceptCategoryId);
        }
      });

    if (category) {
      throw new ServiceError(ERRORS.TRACKING_CATEGORY_NAME_EXISTS);
    }
  }

  /**
   * Validates that the option names are unique within a category payload.
   * @param {ITrackingCategoryOptionInput[]} options - Category options.
   */
  public validateOptionsUnique(options: ITrackingCategoryOptionInput[]): void {
    const normalizedNames = new Set<string>();

    options.forEach((option) => {
      const name = option.name.trim().toLowerCase();

      if (!name) {
        throw new ServiceError(ERRORS.INVALID_TRACKING_CATEGORY_OPTION_NAME);
      }
      if (normalizedNames.has(name)) {
        throw new ServiceError(ERRORS.TRACKING_CATEGORY_OPTION_NAME_EXISTS);
      }
      normalizedNames.add(name);
    });
  }

  /**
   * Validates that the given option ids belong to the given category.
   * @param {number} categoryId - Tracking category id.
   * @param {number[]} optionIds - Option ids.
   */
  public async validateOptionIdsBelongToCategory(
    categoryId: number,
    optionIds: number[],
  ): Promise<void> {
    const ids = uniq(optionIds);

    if (ids.length !== optionIds.length) {
      throw new ServiceError(ERRORS.TRACKING_CATEGORY_OPTION_NOT_FOUND);
    }
    if (ids.length === 0) {
      return;
    }
    const optionsCount = await this.trackingCategoryOptionModel()
      .query()
      .where('categoryId', categoryId)
      .whereIn('id', ids)
      .resultSize();

    if (optionsCount !== ids.length) {
      throw new ServiceError(ERRORS.TRACKING_CATEGORY_OPTION_NOT_FOUND);
    }
  }

  /**
   * Validates that the given category is not assigned to any journal entry or
   * account transaction.
   * @param {number} categoryId - Tracking category id.
   */
  public async validateCategoryNotInUse(categoryId: number): Promise<void> {
    const [journalAssignment, transactionAssignment] = await Promise.all([
      this.manualJournalEntryTrackingCategoryModel()
        .query()
        .where('categoryId', categoryId)
        .first(),
      this.accountTransactionTrackingCategoryModel()
        .query()
        .where('categoryId', categoryId)
        .first(),
    ]);

    if (journalAssignment || transactionAssignment) {
      throw new ServiceError(ERRORS.TRACKING_CATEGORY_HAS_ASSIGNMENTS);
    }
  }

  /**
   * Validates that the given options are not assigned to any journal entry or
   * account transaction.
   * @param {number[]} optionIds - Tracking category option ids.
   */
  public async validateOptionsNotInUse(optionIds: number[]): Promise<void> {
    const ids = uniq(optionIds);

    if (ids.length === 0) {
      return;
    }
    const [journalAssignment, transactionAssignment] = await Promise.all([
      this.manualJournalEntryTrackingCategoryModel()
        .query()
        .whereIn('optionId', ids)
        .first(),
      this.accountTransactionTrackingCategoryModel()
        .query()
        .whereIn('optionId', ids)
        .first(),
    ]);

    if (journalAssignment || transactionAssignment) {
      throw new ServiceError(ERRORS.TRACKING_CATEGORY_OPTION_HAS_ASSIGNMENTS);
    }
  }

  /**
   * Validates the tracking assignments of the given manual journal entries.
   *
   * Inactive categories/options are allowed only when the exact assignment
   * already existed on the journal, so archived dimensions are preserved when
   * editing historical journals without allowing new archived assignments.
   *
   * @param {ITrackingCategoryEntry[]} entries - Manual journal entries.
   * @param {IValidateTrackingCategoryEntriesOptions} options
   */
  public async validateEntries(
    entries: ITrackingCategoryEntry[],
    options: IValidateTrackingCategoryEntriesOptions = {},
  ): Promise<void> {
    const {
      allowInactive = false,
      previousAssignments = [],
      previousCategoryIds = [],
      module = TrackingCategoryModule.ManualJournals,
    } = options;

    const assignments: Array<{
      categoryId: number;
      optionId: number;
      index?: number;
    }> = [];

    entries.forEach((entry) => {
      const seenCategoryIds = new Set<number>();

      (entry.trackingCategories ?? []).forEach((assignment) => {
        if (!assignment?.categoryId || !assignment?.optionId) {
          throw new ServiceError(
            ERRORS.INVALID_TRACKING_CATEGORY_ASSIGNMENT,
            undefined,
            { index: entry.index },
          );
        }
        if (seenCategoryIds.has(assignment.categoryId)) {
          throw new ServiceError(
            ERRORS.DUPLICATE_TRACKING_CATEGORY_ASSIGNMENT,
            undefined,
            { index: entry.index },
          );
        }
        seenCategoryIds.add(assignment.categoryId);
        assignments.push({ ...assignment, index: entry.index });
      });
    });

    if (assignments.length === 0) {
      return;
    }
    const categoryIds = uniq(
      assignments.map((assignment) => assignment.categoryId),
    );
    const categories = await this.trackingCategoryModel()
      .query()
      .whereIn('id', categoryIds)
      .withGraphFetched('options');

    const categoriesMap = new Map(
      categories.map((category) => [category.id, category]),
    );
    const previousAssignmentsSet = new Set(previousAssignments);
    const previousCategoryIdsSet = new Set(previousCategoryIds);

    assignments.forEach((assignment) => {
      const category = categoriesMap.get(assignment.categoryId);
      const pairKey = `${assignment.categoryId}:${assignment.optionId}`;

      if (!category) {
        throw new ServiceError(ERRORS.TRACKING_CATEGORY_NOT_FOUND, undefined, {
          categoryId: assignment.categoryId,
          index: assignment.index,
        });
      }
      const option = (category.options ?? []).find(
        (item) => item.id === assignment.optionId,
      );

      if (!option) {
        throw new ServiceError(
          ERRORS.TRACKING_CATEGORY_OPTION_MISMATCH,
          undefined,
          {
            categoryId: assignment.categoryId,
            optionId: assignment.optionId,
            index: assignment.index,
          },
        );
      }
      const isPreviouslyUsed = previousAssignmentsSet.has(pairKey);
      const isCategoryPreviouslyUsed = previousCategoryIdsSet.has(
        assignment.categoryId,
      );

      if (
        !isTrackingCategoryAvailableForModule(category, module) &&
        !isCategoryPreviouslyUsed
      ) {
        throw new ServiceError(
          ERRORS.TRACKING_CATEGORY_MODULE_NOT_ALLOWED,
          undefined,
          {
            categoryId: assignment.categoryId,
            module,
            index: assignment.index,
          },
        );
      }
      if (!category.active && !(allowInactive && isPreviouslyUsed)) {
        throw new ServiceError(ERRORS.INACTIVE_TRACKING_CATEGORY, undefined, {
          categoryId: assignment.categoryId,
          index: assignment.index,
        });
      }
      if (!option.active && !(allowInactive && isPreviouslyUsed)) {
        throw new ServiceError(
          ERRORS.INACTIVE_TRACKING_CATEGORY_OPTION,
          undefined,
          {
            categoryId: assignment.categoryId,
            optionId: assignment.optionId,
            index: assignment.index,
          },
        );
      }
    });
  }
}
