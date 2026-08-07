import { Button, Intent, Position, Tag } from '@blueprintjs/core';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { round } from 'lodash';
import moment from 'moment';
import React from 'react';
import { useAccountTransactionsContext } from '../../AccountTransactions/AccountTransactionsProvider';
import { withBanking } from '../../withBanking';
import { withBankingActions } from '../../withBankingActions';
import { initialValues, transformToReq } from './_utils';
import {
  MatchingReconcileTransactionBoot,
  useMatchingReconcileTransactionBoot,
} from './MatchingReconcileTransactionBoot';
import styles from './MatchingReconcileTransactionForm.module.scss';
import { MatchingReconcileFormSchema } from './MatchingReconcileTransactionForm.schema';
import type { MatchingReconcileTransactionValues } from './_types';
import type { WithBankingProps } from '../../withBanking';
import type { WithBankingActionsProps } from '../../withBankingActions';
import {
  AccountsSelect,
  AppToaster,
  Box,
  BranchSelect,
  FDateInput,
  FeatureCan,
  FFormGroup,
  FInputGroup,
  FMoneyInputGroup,
  Group,
  Icon,
} from '@/components';
import { Aside } from '@/components/Aside/Aside';
import { ContentTabs } from '@/components/ContentTabs';
import { Features } from '@/constants';
import { useCreateCashflowTransaction } from '@/hooks/query';
import { compose } from '@/utils';
import { momentFormatter } from '@/utils';

interface ReconcileSubmitSuccessPayload {
  id: number;
  type: string;
}

interface MatchingReconcileTransactionFormProps
  extends Pick<WithBankingActionsProps, 'closeReconcileMatchingTransaction'>,
    Pick<WithBankingProps, 'reconcileMatchingTransactionPendingAmount'> {
  onSubmitSuccess?: (values: ReconcileSubmitSuccessPayload) => void;
}

function MatchingReconcileTransactionFormRoot({
  closeReconcileMatchingTransaction,
  reconcileMatchingTransactionPendingAmount,

  // #props
  onSubmitSuccess,
}: MatchingReconcileTransactionFormProps) {
  // Mutation create cashflow transaction.
  const { mutateAsync: createCashflowTransactionMutate } =
    useCreateCashflowTransaction();

  const { accountId } = useAccountTransactionsContext();

  // Handles the aside close.
  const handleAsideClose = () => {
    closeReconcileMatchingTransaction();
  };
  // Handle the form submitting.
  const handleSubmit = (
    values: MatchingReconcileTransactionValues,
    {
      setSubmitting,
      setErrors,
    }: FormikHelpers<MatchingReconcileTransactionValues>,
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
        // SDK mutation types as `void`; the backend response shape isn't captured,
        // so we can't forward the new transaction id. Caller's auto-mark effect
        // won't fire — users manually match after creating.
      })
      .catch(
        (error: {
          response?: { data?: { errors?: Array<{ type: string }> } };
        }) => {
          setSubmitting(false);
          if (
            error.response?.data?.errors?.find(
              (e) => e.type === 'BRANCH_ID_REQUIRED',
            )
          ) {
            setErrors({
              ...({} as MatchingReconcileTransactionValues),
              branchId: 'The branch is required.',
            });
          } else {
            AppToaster.show({
              message: 'Something went wrong.',
              intent: Intent.DANGER,
            });
          }
        },
      );
  };

  const _initialValues: MatchingReconcileTransactionValues = {
    ...initialValues,
    amount: String(
      round(Math.abs(reconcileMatchingTransactionPendingAmount), 2) || 0,
    ),
    date: moment().format('YYYY-MM-DD'),
    type:
      reconcileMatchingTransactionPendingAmount > 0 ? 'deposit' : 'withdrawal',
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
          initialValues={_initialValues}
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

export const MatchingReconcileTransactionForm = compose(
  withBankingActions,
  withBanking(({ reconcileMatchingTransactionPendingAmount }) => ({
    reconcileMatchingTransactionPendingAmount,
  })),
)(MatchingReconcileTransactionFormRoot);

function ReconcileMatchingType() {
  const { setFieldValue, values } =
    useFormikContext<MatchingReconcileTransactionValues>();

  const handleChange = (value: string) => {
    setFieldValue('type', value);
    setFieldValue('category', '');
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

function CreateReconcileTransactionContent() {
  const { branches } = useMatchingReconcileTransactionBoot();

  return (
    <Box className={styles.content}>
      <ReconcileMatchingType />

      <FFormGroup label={'Date'} name={'date'} fastField>
        <FDateInput
          {...momentFormatter('YYYY/MM/DD')}
          name={'date'}
          popoverProps={{
            minimal: false,
            position: Position.LEFT,
            modifiers: {
              preventOverflow: { enabled: true },
            },
            boundary: 'viewport',
          }}
          inputProps={{ fill: true, leftElement: <Icon icon={'date-range'} /> }}
          fill
          fastField
        />
      </FFormGroup>

      <FFormGroup
        label={'Amount'}
        name={'amount'}
        labelInfo={<Tag minimal>Required</Tag>}
        fastField
      >
        <FMoneyInputGroup name={'amount'} fastField />
      </FFormGroup>

      <MatchingReconcileCategoryField />

      <FFormGroup
        label={'Memo'}
        name={'memo'}
        labelInfo={<Tag minimal>Required</Tag>}
        fastField
      >
        <FInputGroup name={'memo'} fastField />
      </FFormGroup>

      <FFormGroup label={'Reference No.'} name={'referenceNo'} fastField>
        <FInputGroup name={'referenceNo'} />
      </FFormGroup>

      <FeatureCan feature={Features.Branches}>
        <FFormGroup
          name={'branchId'}
          label={'Branch'}
          labelInfo={<Tag minimal>Required</Tag>}
          fastField
        >
          <BranchSelect
            name={'branchId'}
            branches={branches}
            popoverProps={{
              minimal: false,
              position: Position.LEFT,
              modifiers: {
                preventOverflow: { enabled: true },
              },
              boundary: 'viewport',
            }}
            fastField
          />
        </FFormGroup>
      </FeatureCan>
    </Box>
  );
}

function MatchingReconcileCategoryField() {
  const { accounts } = useMatchingReconcileTransactionBoot();
  const { values } = useFormikContext<MatchingReconcileTransactionValues>();

  return (
    <FFormGroup
      label={'Category'}
      name={'category'}
      labelInfo={<Tag minimal>Required</Tag>}
      fastField
    >
      <AccountsSelect
        name={'category'}
        // @ts-expect-error AccountsSelect expects AccountSelectModel[] (with
        // SelectOptionProps) but the boot provides raw Account[] — runtime tolerates.
        items={accounts}
        popoverProps={{
          minimal: false,
          position: Position.LEFT,
          modifiers: {
            preventOverflow: { enabled: true },
          },
          boundary: 'viewport',
        }}
        filterByRootTypes={values.type === 'deposit' ? ['income'] : ['expense']}
        fastField
      />
    </FFormGroup>
  );
}

interface FormikState {
  isSubmitting: boolean;
}

function MatchingReconcileTransactionFooter() {
  const { isSubmitting } = useFormikContext<FormikState>();

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
