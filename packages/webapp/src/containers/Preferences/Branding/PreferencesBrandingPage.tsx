import * as R from 'ramda';
import { useEffect } from 'react';
import { PreferencesBrandingBoot } from './PreferencesBrandingBoot';
import { PreferencesBrandingForm } from './PreferencesBrandingForm';
import {
  PreferencesBrandingFormContent,
  PreferencesBrandingFormFooter,
} from './PreferencesBrandingFormContent';
import { Stack } from '@/components';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';

type PreferencesBrandingPageRootProps = Pick<
  WithDashboardActionsProps,
  'changePreferencesPageTitle'
>;

function PreferencesBrandingPageRoot({
  changePreferencesPageTitle,
}: PreferencesBrandingPageRootProps) {
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

export const PreferencesBrandingPage = R.compose(withDashboardActions)(
  PreferencesBrandingPageRoot,
);
