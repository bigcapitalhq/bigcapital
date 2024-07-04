// @ts-nocheck
import * as R from 'ramda';
import { Button, Intent, Position, Tag } from '@blueprintjs/core';
import { Form, Formik, FormikValues, useFormikContext } from 'formik';
import {
  AccountsSelect,
  AppToaster,
  Box,
  BranchSelect,
  FDateInput,
  FFormGroup,
  FInputGroup,
  FMoneyInputGroup,
  Group,
} from '@/components';
import { Aside } from '@/components/Aside/Aside';
import { momentFormatter } from '@/utils';
import styles from './MatchingReconcileTransactionForm.module.scss';
import { ContentTabs } from '@/components/ContentTabs';
import { withBankingActions } from '../../withBankingActions';
import {
  MatchingReconcileTransactionBoot,
  useMatchingReconcileTransactionBoot,
} from './MatchingReconcileTransactionBoot';
import { useCreateCashflowTransaction } from '@/hooks/query';
import { useAccountTransactionsContext } from '../../AccountTransactions/AccountTransactionsProvider';
import { MatchingReconcileFormSchema } from './MatchingReconcileTransactionForm.schema';
import { initialValues } from './_utils';

function MatchingReconcileTransactionFormRoot({
  closeReconcileMatchingTransaction,
}) {
  // Mutation create cashflow transaction.
  const { mutateAsync: createCashflowTransactionMutate } =
    useCreateCashflowTransaction();

  const { accountId } = useAccountTransactionsContext();

  const handleAsideClose = () => {
    closeReconcileMatchingTransaction();
  };
  const handleSubmit = (
    values: MatchingReconcileTransactionValues,
    { setSubmitting }: FormikValues<MatchingReconcileTransactionValues>,
  ) => {
    setSubmitting(true);
    const _values = transformToReq(values, accountId);

    createCashflowTransactionMutate(_values)
      .then(() => {
        setSubmitting(false);

        AppToaster.show({
          message: 'The transaction has been created.',
          intent: Intent.SUCCESS,
        });
        closeReconcileMatchingTransaction();
      })
      .catch((error) => {
        setSubmitting(false);

        AppToaster.show({
          message: 'Something went wrong.',
          intent: Intent.DANGER,
        });
      });
  };

  return (
    <Aside
      title={'Create Reconcile Transactions'}
      className={styles.asideRoot}
      onClose={handleAsideClose}
    >
      <MatchingReconcileTransactionBoot>
        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={MatchingReconcileFormSchema}
        >
          <Form className={styles.form}>
            <Aside.Body className={styles.asideContent}>
              <CreateReconcileTransactionContent />
            </Aside.Body>

            <Aside.Footer className={styles.asideFooter}>
              <MatchingReconcileTransactionFooter />
            </Aside.Footer>
          </Form>
        </Formik>
      </MatchingReconcileTransactionBoot>
    </Aside>
  );
}

export const MatchingReconcileTransactionForm = R.compose(withBankingActions)(
  MatchingReconcileTransactionFormRoot,
);

export function MatchingReconcileTransactionFooter() {
  const { isSubmitting } = useFormikContext();

  return (
    <Box className={styles.footer}>
      <Group>
        <Button
          fill
          type={'submit'}
          intent={Intent.PRIMARY}
          loading={isSubmitting}
        >
          Submit
        </Button>
      </Group>
    </Box>
  );
}

function ReconcileMatchingType() {
  const { setFieldValue, values } =
    useFormikContext<MatchingReconcileFormValues>();

  const handleChange = (value: string) => {
    setFieldValue('type', value);
  };
  return (
    <ContentTabs
      value={values?.type || 'deposit'}
      onChange={handleChange}
      small
    >
      <ContentTabs.Tab id={'deposit'} title={'Deposit'} />
      <ContentTabs.Tab id={'withdrawal'} title={'Withdrawal'} />
    </ContentTabs>
  );
}

export function CreateReconcileTransactionContent() {
  const { accounts, branches } = useMatchingReconcileTransactionBoot();

  return (
    <Box className={styles.content}>
      <ReconcileMatchingType />

      <FFormGroup label={'Date'} name={'date'}>
        <FDateInput
          {...momentFormatter('YYYY/MM/DD')}
          name={'date'}
          formatDate={(date) => date.toLocaleString()}
          popoverProps={{
            position: Position.LEFT,
          }}
          inputProps={{ fill: true }}
          fill
        />
      </FFormGroup>

      <FFormGroup
        label={'Amount'}
        name={'amount'}
        labelInfo={<Tag minimal>Required</Tag>}
      >
        <FMoneyInputGroup name={'amount'} />
      </FFormGroup>

      <FFormGroup
        label={'Category'}
        name={'category'}
        labelInfo={<Tag minimal>Required</Tag>}
      >
        <AccountsSelect
          name={'category'}
          items={accounts}
          popoverProps={{ minimal: false, position: Position.LEFT }}
        />
      </FFormGroup>

      <FFormGroup
        label={'Memo'}
        name={'memo'}
        labelInfo={<Tag minimal>Required</Tag>}
      >
        <FInputGroup name={'memo'} />
      </FFormGroup>

      <FFormGroup label={'Reference No.'} name={'reference_no'}>
        <FInputGroup name={'reference_no'} />
      </FFormGroup>

      <FFormGroup name={'branchId'} label={'Branch'}>
        <BranchSelect
          name={'branchId'}
          branches={branches}
          popoverProps={{ minimal: true }}
        />
      </FFormGroup>
    </Box>
  );
}
