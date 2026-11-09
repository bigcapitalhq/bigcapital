import { uniq } from 'lodash';
import {
  ITrackingCategoryEntry,
  TRACKING_CATEGORY_MODULES,
  TrackingCategoryModule,
} from './types/TrackingCategory.types';

/**
 * Normalizes the given tracking category modules to the supported list.
 * Missing modules fall back to all supported modules for backward
 * compatibility with categories created before the modules field existed.
 * An explicit empty list means the category is not available for any module.
 * @param {TrackingCategoryModule[]} [modules] - Tracking category modules.
 * @returns {TrackingCategoryModule[]}
 */
export const normalizeTrackingCategoryModules = (
  modules?: TrackingCategoryModule[] | null,
): TrackingCategoryModule[] => {
  if (modules === undefined || modules === null) {
    return [...TRACKING_CATEGORY_MODULES];
  }
  return TRACKING_CATEGORY_MODULES.filter((module) => modules.includes(module));
};

/**
 * Determines whether the given tracking category is available for the given
 * module.
 * @param {object} category - Tracking category.
 * @param {TrackingCategoryModule} module - Module name.
 * @returns {boolean}
 */
export const isTrackingCategoryAvailableForModule = (
  category: { modules?: TrackingCategoryModule[] | null },
  module: TrackingCategoryModule,
): boolean => {
  return normalizeTrackingCategoryModules(category.modules).includes(module);
};

/**
 * Retrieves the unique tracking category ids assigned to the given entries.
 * @param {ITrackingCategoryEntry[]} entries - Entries with tracking category assignments.
 * @returns {number[]}
 */
export const getAssignedTrackingCategoryIds = (
  entries: ITrackingCategoryEntry[] = [],
): number[] => {
  return uniq(
    entries.flatMap((entry) =>
      (entry.trackingCategories ?? []).map(
        (assignment) => assignment.categoryId,
      ),
    ),
  );
};
