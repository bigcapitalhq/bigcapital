import { ServiceError } from '@/exceptions';
import { ERRORS } from './constants';

export const validateLinkModelExists = (LinkModel) => {
  if (!LinkModel) {
    throw new ServiceError(ERRORS.DOCUMENT_LINK_REF_INVALID);
  }
};

export const validateLinkModelEntryExists = (foundLinkModel) => {
  if (!foundLinkModel) {
    throw new ServiceError(ERRORS.DOCUMENT_LINK_ID_INVALID);
  }
};
