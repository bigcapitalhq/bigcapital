import { AnchorButton, Button, Intent, Tag, Text } from '@blueprintjs/core';
import {
  FastField,
  FastFieldProps,
  Formik,
  FormikHelpers,
  useFormikContext,
} from 'formik';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { withBanking } from '../withBanking';
import { withBankingActions } from '../withBankingActions';
import styles from './CategorizeTransactionAside.module.scss';
import { useCategorizeTransactionTabsBoot } from './CategorizeTransactionTabsBoot';
import { MatchingReconcileTransactionForm } from './MatchingReconcileTransactionAside/MatchingReconcileTransactionForm';
import {
  MatchingTransactionBoot,
  useMatchingTransactionBoot,
} from './MatchingTransactionBoot';
import { MatchTransactionCheckbox } from './MatchTransactionCheckbox';
import {
  transformToReq,
  useGetPendingAmountMatched,
  useIsShowReconcileTransactionLink,
} from './utils';
import type { MatchTransactionCheckboxProps } from './MatchTransactionCheckbox';
import type { MatchingTransactionFormValues } from './types';
import type { WithBankingProps } from '../withBanking';
import type { WithBankingActionsProps } from '../withBankingActions';
import { AppToaster, Box, FormatNumber, Group, Stack } from '@/components';
import { useMatchUncategorizedTransaction } from '@/hooks/query/banking';
import { useIsDarkMode } from '@/hooks/useDarkMode';
import { compose } from '@/utils';

const initialValues: MatchingTransactionFormValues = {
  matched: {},
};

interface MatchingBankTransactionRootProps
  extends Pick<WithBankingActionsProps, 'closeMatchingTransactionAside'>,
    Pick<WithBankingProps, 'transactionsToCategorizeIdsSelected'> {}

interface ReconcileSubmitPayload {
  refId: number;
  refType: string;
}

/**
 * Renders the bank transaction matching form.
 */
function MatchingBankTransactionRoot({
  // #withBankingActions
  closeMatchingTransactionAside,
}: MatchingBankTransactionRootProps) {
  const { uncategorizedTransactionIds } = useCategorizeTransactionTabsBoot();
  const { mutateAsync: matchTransaction } = useMatchUncategorizedTransaction();

  // Handles the form submitting.
  const handleSubmit = (
    values: MatchingTransactionFormValues,
    { setSubmitting }: FormikHelpers<MatchingTransactionFormValues>,
  ) => {
    const _values = transformToReq(values, uncategorizedTransactionIds);

    if (_values.matchedTransactions?.length === 0) {
      AppToaster.show({
        message: 'You should select at least one transaction for matching.',
        intent: Intent.DANGER,
      });
      return;
    }
    setSubmitting(true);
    // @ts-expect-error SDK `MatchTransactionBody.matchedTransactions` is typed
    // as `string[]` but the schema example and runtime expect objects.
    matchTransaction(_values)
      .then(() => {
        AppToaster.show({
          intent: Intent.SUCCESS,
          message: 'The bank transaction has been matched successfully.',
        });
        setSubmitting(false);
        closeMatchingTransactionAside();
      })
      .catch(
        (err: {
          response?: { data?: { errors?: Array<{ type: string }> } };
        }) => {
          if (
            err.response?.data?.errors?.find(
              (e) => e.type === 'TOTAL_MATCHING_TRANSACTIONS_INVALID',
            )
          ) {
            AppToaster.show({
              message: `The total amount does not equal the uncategorized transaction.`,
              intent: Intent.DANGER,
            });
            setSubmitting(false);
            return;
          }
          AppToaster.show({
            intent: Intent.DANGER,
            message: 'Something went wrong.',
          });
          setSubmitting(false);
        },
      );
  };

  return (
    <MatchingTransactionBoot
      uncategorizedTransactionsIds={uncategorizedTransactionIds}
    >
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <MatchingBankTransactionFormContent />
      </Formik>
    </MatchingTransactionBoot>
  );
}

export const MatchingBankTransaction = compose(
  withBankingActions,
  withBanking(({ transactionsToCategorizeIdsSelected }) => ({
    transactionsToCategorizeIdsSelected,
  })),
)(MatchingBankTransactionRoot);

interface MatchingBankTransactionFormContentProps
  extends Pick<WithBankingProps, 'openReconcileMatchingTransaction'> {}

/**
 * Matching bank transaction form content.
 */
const MatchingBankTransactionFormContent = compose(
  withBanking(({ openReconcileMatchingTransaction }) => ({
    openReconcileMatchingTransaction,
  })),
)(({
  // #withBanking — boolean state for whether the reconcile aside is open
  openReconcileMatchingTransaction,
}: MatchingBankTransactionFormContentProps) => {
  const {
    isMatchingTransactionsFetching,
    isMatchingTransactionsSuccess,
    matches,
  } = useMatchingTransactionBoot();
  const [pending, setPending] = useState<ReconcileSubmitPayload | null>(null);

  const { setFieldValue } = useFormikContext<MatchingTransactionFormValues>();

  // This effect is responsible for automatically marking a transaction as matched
  // when the matching process is successful and not currently fetching.
  useEffect(() => {
    if (
      pending &&
      isMatchingTransactionsSuccess &&
      !isMatchingTransactionsFetching
    ) {
      const foundMatch = matches?.find(
        (m: { referenceType: string; referenceId: number }) =>
          m.referenceType === pending?.refType &&
          m.referenceId === pending?.refId,
      );
      if (foundMatch) {
        setFieldValue(`matched.${pending.refType}-${pending.refId}`, true);
      }
      setPending(null);
    }
  }, [
    isMatchingTransactionsFetching,
    isMatchingTransactionsSuccess,
    matches,
    pending,
    setFieldValue,
  ]);

  const handleReconcileFormSubmitSuccess = (
    payload: ReconcileSubmitPayload,
  ) => {
    setPending({ refId: payload.refId, refType: payload.refType });
  };

  return (
    <>
      <MatchingBankTransactionContent />

      {openReconcileMatchingTransaction && (
        <MatchingReconcileTransactionForm
          onSubmitSuccess={handleReconcileFormSubmitSuccess}
        />
      )}
      {!openReconcileMatchingTransaction && <MatchTransactionFooter />}
    </>
  );
});

function MatchingBankTransactionContent() {
  return (
    <Box className={styles.root}>
      <PerfectMatchingTransactions />
      <PossibleMatchingTransactions />
    </Box>
  );
}

interface MatchItem {
  transsactionTypeFormatted: string;
  amountFormatted: string;
  dateFormatted: string;
  referenceType: string;
  referenceId: number;
}

/**
 * Renders the perfect match transactions.
 */
function PerfectMatchingTransactions() {
  const { perfectMatches, perfectMatchesCount } = useMatchingTransactionBoot();

  // Can't continue if the perfect matches is empty.
  if (isEmpty(perfectMatches)) {
    return null;
  }
  return (
    <>
      <Box className={styles.matchBar}>
        <Group spacing={6}>
          <h2 className={styles.matchBarTitle}>Perfect Matchines</h2>
          <Tag minimal round intent={Intent.SUCCESS}>
            {perfectMatchesCount}
          </Tag>
        </Group>
      </Box>

      <Stack spacing={9} style={{ padding: '12px 15px' }}>
        {perfectMatches.map((match: MatchItem, index: number) => (
          <MatchTransactionField
            key={index}
            label={`${match.transsactionTypeFormatted} for ${match.amountFormatted}`}
            date={match.dateFormatted}
            transactionId={match.referenceId}
            transactionType={match.referenceType}
          />
        ))}
      </Stack>
    </>
  );
}

/**
 * Renders the possible match transactions.
 */
function PossibleMatchingTransactions() {
  const { possibleMatches } = useMatchingTransactionBoot();

  // Can't continue if the possible matches is empty.
  if (isEmpty(possibleMatches)) {
    return null;
  }
  return (
    <>
      <Box className={styles.matchBar}>
        <Stack spacing={2}>
          <h2 className={styles.matchBarTitle}>Possible Matches</h2>
        </Stack>
      </Box>

      <Stack spacing={9} style={{ padding: '12px 15px' }}>
        {possibleMatches.map((match: MatchItem, index: number) => (
          <MatchTransactionField
            key={index}
            label={
              <>
                {`${match.transsactionTypeFormatted} for `}
                <strong>{match.amountFormatted}</strong>
              </>
            }
            date={match.dateFormatted}
            transactionId={match.referenceId}
            transactionType={match.referenceType}
          />
        ))}
      </Stack>
    </>
  );
}

interface MatchTransactionFieldProps
  extends Omit<
    MatchTransactionCheckboxProps,
    'onChange' | 'active' | 'initialActive'
  > {
  transactionId: number;
  transactionType: string;
}

function MatchTransactionField({
  transactionId,
  transactionType,
  ...props
}: MatchTransactionFieldProps) {
  const name = `matched.${transactionType}-${transactionId}`;

  return (
    <FastField name={name}>
      {({ form, field: { value } }: FastFieldProps) => (
        <MatchTransactionCheckbox
          {...props}
          active={!!value}
          onChange={(state: boolean) => {
            form.setFieldValue(name, state);
          }}
        />
      )}
    </FastField>
  );
}

interface MatchTransctionFooterProps
  extends Pick<
    WithBankingActionsProps,
    'closeMatchingTransactionAside' | 'openReconcileMatchingTransaction'
  > {}

/**
 * Renders the match transactions footer.
 */
const MatchTransactionFooter = compose(withBankingActions)(({
  closeMatchingTransactionAside,
  openReconcileMatchingTransaction,
}: MatchTransctionFooterProps) => {
  const { submitForm, isSubmitting } =
    useFormikContext<MatchingTransactionFormValues>();
  const totalPending = useGetPendingAmountMatched();
  const showReconcileLink = useIsShowReconcileTransactionLink();
  const submitDisabled = totalPending !== 0;
  const isDarkMode = useIsDarkMode();

  const handleCancelBtnClick = () => {
    closeMatchingTransactionAside();
  };
  const handleSubmitBtnClick = () => {
    submitForm();
  };
  const handleReconcileTransaction = () => {
    openReconcileMatchingTransaction(totalPending);
  };

  return (
    <Box className={styles.footer}>
      <Box className={styles.footerTotal}>
        <Group position={'apart'}>
          {showReconcileLink && (
            <AnchorButton
              small
              minimal
              intent={Intent.PRIMARY}
              onClick={handleReconcileTransaction}
            >
              Add Reconcile Transaction +
            </AnchorButton>
          )}
          <Text
            style={{
              fontSize: 14,
              marginLeft: 'auto',
              color: isDarkMode ? 'var(--color-light-gray1)' : '#404854',
            }}
            tagName="span"
          >
            Pending{' '}
            <FormatNumber
              value={totalPending}
              currency={'USD'}
              noZero={false}
            />
          </Text>
        </Group>
      </Box>

      <Box className={styles.footerActions}>
        <Group spacing={10}>
          <Button
            intent={Intent.PRIMARY}
            style={{ minWidth: 85 }}
            onClick={handleSubmitBtnClick}
            loading={isSubmitting}
            disabled={submitDisabled}
          >
            Match
          </Button>

          <Button onClick={handleCancelBtnClick}>Cancel</Button>
        </Group>
      </Box>
    </Box>
  );
});

MatchTransactionFooter.displayName = 'MatchTransactionFooter';
