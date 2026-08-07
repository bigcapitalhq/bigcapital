import classNames from 'classnames';
import React from 'react';
import styled from 'styled-components';
import { PreferencesPageLoader } from '../PreferencesPageLoader';
import type { SettingsGroup } from '@bigcapital/sdk-ts';
import { Card } from '@/components';
import { CLASSES } from '@/constants/classes';
import { useSettingsInvoices } from '@/hooks/query';

export interface PreferencesInvoicesBootContextValue {
  invoiceSettings?: SettingsGroup;
  isSettingsLoading: boolean;
}

const PreferencesInvoicesFormContext =
  React.createContext<PreferencesInvoicesBootContextValue>(
    {} as PreferencesInvoicesBootContextValue,
  );

export interface PreferencesInvoicesBootProps {
  children?: React.ReactNode;
}

function PreferencesInvoicesBoot({
  children,
  ...props
}: PreferencesInvoicesBootProps) {
  // Fetches organization settings.
  const { data: invoiceSettings, isLoading: isSettingsLoading } =
    useSettingsInvoices();

  // Provider state.
  const provider: PreferencesInvoicesBootContextValue = {
    invoiceSettings,
    isSettingsLoading,
  };

  // Detarmines whether if any query is loading.
  const isLoading = isSettingsLoading;

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT_ACCOUNTANT,
      )}
    >
      <PreferencesInvoicesCard>
        {isLoading ? (
          <PreferencesPageLoader />
        ) : (
          <PreferencesInvoicesFormContext.Provider value={provider}>
            {children}
          </PreferencesInvoicesFormContext.Provider>
        )}
      </PreferencesInvoicesCard>
    </div>
  );
}

const PreferencesInvoicesCard = styled(Card)`
  padding: 25px;

  .bp4-form-group {
    max-width: 600px;
  }
`;

export const usePreferencesInvoiceFormContext = () =>
  React.useContext(PreferencesInvoicesFormContext);

export { PreferencesInvoicesBoot };
