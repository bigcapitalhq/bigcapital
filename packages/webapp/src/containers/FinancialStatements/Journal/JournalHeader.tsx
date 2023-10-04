// @ts-nocheck
import React from 'react';
import * as Yup from 'yup';
import styled from 'styled-components';
import moment from 'moment';
import { Formik, Form } from 'formik';
import { Tab, Tabs, Button, Intent } from '@blueprintjs/core';

import { FormattedMessage as T } from '@/components';

import JournalSheetHeaderGeneral from './JournalSheetHeaderGeneral';
import FinancialStatementHeader from '@/containers/FinancialStatements/FinancialStatementHeader';

import withJournal from './withJournal';
import withJournalActions from './withJournalActions';

import { compose } from '@/utils';

/**
 * Journal sheet header.
 */
function JournalHeader({
  pageFilter,
  onSubmitFilter,

  // #withJournalActions
  toggleJournalSheetFilter,

  // #withJournal
  journalSheetDrawerFilter,
}) {
  const initialValues = {
    ...pageFilter,
    fromDate: moment(pageFilter.fromDate).toDate(),
    toDate: moment(pageFilter.toDate).toDate(),
  };

  // Validation schema.
  const validationSchema = Yup.object().shape({
    fromDate: Yup.date().required(),
    toDate: Yup.date().min(Yup.ref('fromDate')).required(),
  });

  // Handle form submit.
  const handleSubmit = (values, { setSubmitting }) => {
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
              panel={<JournalSheetHeaderGeneral />}
            />
          </Tabs>

          <div class="financial-header-drawer__footer">
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

export default compose(
  withJournal(({ journalSheetDrawerFilter }) => ({
    journalSheetDrawerFilter,
  })),
  withJournalActions,
)(JournalHeader);

const JournalDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 350px;
  }
`;
