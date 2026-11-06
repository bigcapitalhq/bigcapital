import { Button, Intent } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import intl from 'react-intl-universal';
import { useHistory, useLocation } from 'react-router-dom';
import { useRecurringInvoiceFormContext } from './RecurringInvoiceFormProvider';
import { RecurringInvoiceGeneratedInvoicesDialog } from './RecurringInvoiceGeneratedInvoicesDialog';
import { Group, Icon } from '@/components';

export function RecurringInvoiceFloatingActions() {
  const history = useHistory();
  const location = useLocation<{ openGeneratedInvoices?: boolean }>();
  const { isSubmitting, isValid, dirty } = useFormikContext();
  const { isNewMode } = useRecurringInvoiceFormContext();
  const [isGeneratedInvoicesOpen, setGeneratedInvoicesOpen] = useState(
    !!location.state?.openGeneratedInvoices,
  );

  return (
    <>
      <Group spacing={10} position={'right'}>
        {!isNewMode && (
          <Button
            minimal
            icon={<Icon icon={'document'} />}
            onClick={() => setGeneratedInvoicesOpen(true)}
            disabled={isSubmitting}
          >
            {intl.get('recurring_invoice.generated_invoices')}
          </Button>
        )}
        <Button
          intent={Intent.PRIMARY}
          type="submit"
          loading={isSubmitting}
          disabled={!isValid || (!dirty && !isNewMode)}
          icon={<Icon icon={'floppy-disk'} />}
        >
          {isNewMode ? intl.get('create') : intl.get('save')}
        </Button>
        <Button
          onClick={() => history.push('/recurring-invoices')}
          disabled={isSubmitting}
        >
          {intl.get('cancel')}
        </Button>
      </Group>

      <RecurringInvoiceGeneratedInvoicesDialog
        isOpen={isGeneratedInvoicesOpen}
        onClose={() => setGeneratedInvoicesOpen(false)}
      />
    </>
  );
}
