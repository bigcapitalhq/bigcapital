import { SetMetadata } from '@nestjs/common';
import { LICENSE_FEATURE_KEY } from '../constants';

export const RequireLicense = (feature: string) =>
  SetMetadata(LICENSE_FEATURE_KEY, feature);
