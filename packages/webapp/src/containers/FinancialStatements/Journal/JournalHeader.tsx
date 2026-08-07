import { Tab, Tabs, Button, Intent } from '@blueprintjs/core';
import { Formik, Form, FormikHelpers } from 'formik';
import moment from 'moment';
import React from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import { JournalSheetHeaderGeneralPanel } from './JournalSheetHeaderGeneral';
import { withJournal } from './withJournal';
import { withJournalActions } from './withJournalActions';
import type { WithJournalProps } from './withJournal';
import type { WithJournalActionsProps } from './withJournalActions';
import { FormattedMessage as T } from '@/components';
import { FinancialStatementHeader } from '@/containers/FinancialStatements/FinancialStatementHeader';
import { compose } from '@/utils';

interface JournalHeaderFormValues {
  fromDate: Date;
  toDate: Date;
  [key: string]: unknown;
}

interface JournalHeaderOwnProps {
  pageFilter: Record<string, unknown>;
  onSubmitFilter: (values: Record<string, unknown>) => void;
}

type JournalHeaderProps = JournalHeaderOwnProps &
  Pick<WithJournalActionsProps, 'toggleJournalSheetFilter'> &
  WithJournalProps;

/**
 * Journal sheet header.
 */
function JournalHeaderInner({
  pageFilter,
  onSubmitFilter,

  // #withJournalActions
  toggleJournalSheetFilter,

  // #withJournal
  journalSheetDrawerFilter,
}: JournalHeaderProps) {
  const initialValues: JournalHeaderFormValues = {
    ...pageFilter,
    fromDate: moment(pageFilter.fromDate as string).toDate(),
    toDate: moment(pageFilter.toDate as string).toDate(),
  };

  // Validation schema.
  const validationSchema = Yup.object().shape({
    fromDate: Yup.date().required(),
    toDate: Yup.date().min(Yup.ref('fromDate')).required(),
  });

  // Handle form submit.
  const handleSubmit = (
    values: JournalHeaderFormValues,
    { setSubmitting }: FormikHelpers<JournalHeaderFormValues>,
  ) => {
    onSubmitFilter(values);
    setSubmitting(false);
    toggleJournalSheetFilter(false);
  };

  // Handle cancel journal drawer header.
  const handleCancelClick = () => {
    toggleJournalSheetFilter(false);
  };

  const handleDrawerClose = () => {
    toggleJournalSheetFilter(false);
  };

  return (
    <JournalDrawerHeader
      isOpen={journalSheetDrawerFilter}
      drawerProps={{ onClose: handleDrawerClose }}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <Tabs animate={true} vertical={true} renderActiveTabPanelOnly={true}>
            <Tab
              id="general"
              title={<T id={'general'} />}
              panel={<JournalSheetHeaderGeneralPanel />}
            />
          </Tabs>

          <div className="financial-header-drawer__footer">
            <Button className={'mr1'} intent={Intent.PRIMARY} type={'submit'}>
              <T id={'calculate_report'} />
            </Button>
            <Button onClick={handleCancelClick} minimal={true}>
              <T id={'cancel'} />
            </Button>
          </div>
        </Form>
      </Formik>
    </JournalDrawerHeader>
  );
}

export const JournalHeader = compose(
  withJournal(({ journalSheetDrawerFilter }) => ({
    journalSheetDrawerFilter,
  })),
  withJournalActions,
)(JournalHeaderInner);

const JournalDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 350px;
  }
`;
