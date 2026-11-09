import React from 'react';
import { TrackingCategories } from './TrackingCategories';
import { TrackingCategoriesProvider } from './TrackingCategoriesProvider';

/**
 * Tracking categories preferences page.
 */
export function TrackingCategoriesPreferences() {
  return (
    <TrackingCategoriesProvider>
      <TrackingCategories />
    </TrackingCategoriesProvider>
  );
}
