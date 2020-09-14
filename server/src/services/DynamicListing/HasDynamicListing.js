import { DYNAMIC_LISTING_ERRORS } from 'services/DynamicListing/DynamicListing';

export const dynamicListingErrorsToResponse = (error) => {
  let _errors;

  if (error.message === DYNAMIC_LISTING_ERRORS.LOGIC_INVALID) {
    _errors.push({
      type: DYNAMIC_LISTING_ERRORS.LOGIC_INVALID,
      code: 200,
    });
  }
  if (
    error.message ===
    DYNAMIC_LISTING_ERRORS.RESOURCE_HAS_NO_FIELDS
  ) {
    _errors.push({
      type: DYNAMIC_LISTING_ERRORS.RESOURCE_HAS_NO_FIELDS,
      code: 300,
    });
  }
  return _errors;
};