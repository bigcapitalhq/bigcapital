// @ts-nocheck
import * as R from 'ramda';
import { useEffect } from 'react';
import { Stack } from '@/components';
import { PreferencesBrandingBoot } from './PreferencesBrandingBoot';
import { PreferencesBrandingForm } from './PreferencesBrandingForm';
import {
  PreferencesBrandingFormContent,
  PreferencesBrandingFormFooter,
} from './PreferencesBrandingFormContent';
import withDashboardActions from '@/containers/Dashboard/withDashboardActions';

function PreferencesBrandingPageRoot({ changePreferencesPageTitle }) {
  useEffect(() => {
    changePreferencesPageTitle('Branding');
  }, [changePreferencesPageTitle]);

  return (
    <Stack
      style={{ padding: '20px 40px 0', maxWidth: 900, width: '100%', flex: 1 }}
    >
      <PreferencesBrandingBoot>
        <PreferencesBrandingForm>
          <PreferencesBrandingFormContent />
          <PreferencesBrandingFormFooter />
        </PreferencesBrandingForm>
      </PreferencesBrandingBoot>
    </Stack>
  );
}

export default R.compose(withDashboardActions)(PreferencesBrandingPageRoot);
