import { Intent } from '@blueprintjs/core';
import intl from 'react-intl-universal';
import { AppToaster } from '@/components';

interface TrackingCategoryFormError {
  type: string;
}

interface TrackingCategoryFormErrorsHandlers {
  setFieldError: (field: string, message: string) => void;
  setSubmitting: (isSubmitting: boolean) => void;
}

/**
 * Handles the tracking category form API errors.
 */
export const handleTrackingCategoryFormErrors = (
  errors: TrackingCategoryFormError[] = [],
  { setFieldError, setSubmitting }: TrackingCategoryFormErrorsHandlers,
) => {
  const hasError = (type: string) =>
    errors.some((error) => error.type === type);

  if (hasError('TRACKING_CATEGORY_NAME_EXISTS')) {
    setFieldError('name', intl.get('tracking_categories.error.name_exists'));
  } else if (hasError('INVALID_TRACKING_CATEGORY_NAME')) {
    setFieldError('name', intl.get('tracking_categories.error.name_required'));
  } else if (hasError('TRACKING_CATEGORY_OPTION_NAME_EXISTS')) {
    AppToaster.show({
      message: intl.get('tracking_categories.error.option_name_exists'),
      intent: Intent.DANGER,
    });
  } else if (hasError('TRACKING_CATEGORY_OPTION_HAS_ASSIGNMENTS')) {
    AppToaster.show({
      message: intl.get('tracking_categories.error.option_in_use'),
      intent: Intent.DANGER,
    });
  } else if (hasError('TRACKING_CATEGORY_MANDATORY_NEEDS_ACTIVE_OPTION')) {
    setFieldError(
      'mandatory',
      intl.get('tracking_categories.error.mandatory_without_active_options'),
    );
  } else {
    AppToaster.show({
      message: intl.get('tracking_categories.error.save_failed'),
      intent: Intent.DANGER,
    });
  }
  setSubmitting(false);
};
