import {
  Alert,
  Button,
  Callout,
  FormGroup,
  HTMLSelect,
  Intent,
  Radio,
  RadioGroup,
} from '@blueprintjs/core';
import classNames from 'classnames';
import * as FF from 'fp-ts/function';
import React, { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { PreferencesPageLoader } from '../PreferencesPageLoader';
import { AccountsTemplateChanges } from './AccountsTemplateChanges';
import type { ApiError } from 'openapi-typescript-fetch';
import { AppToaster, Card, CardFooterActions } from '@/components';
import { CLASSES } from '@/constants/classes';
import {
  withDashboardActions,
  type WithDashboardActionsProps,
} from '@/containers/Dashboard/withDashboardActions';
import {
  useAccountsTemplatePreview,
  useAccountsTemplates,
  useApplyAccountsTemplate,
} from '@/hooks/query';

type ChartOfAccountsPreferencesProps = Pick<
  WithDashboardActionsProps,
  'changePreferencesPageTitle'
>;

/**
 * Chart of accounts preferences: applies a chart of accounts template.
 */
function ChartOfAccountsPreferencesInner({
  changePreferencesPageTitle,
}: ChartOfAccountsPreferencesProps) {
  const [templateKey, setTemplateKey] = useState<string>();
  const [variant, setVariant] = useState<string>();
  const [isConfirming, setIsConfirming] = useState(false);

  const { data: templates, isLoading } = useAccountsTemplates();
  const {
    data: plan,
    isFetching: isPreviewing,
    isError: isPreviewFailed,
  } = useAccountsTemplatePreview({ templateKey, variant });
  const { mutateAsync: applyTemplate, isPending: isApplying } =
    useApplyAccountsTemplate();

  useEffect(() => {
    changePreferencesPageTitle(intl.get('accounts_templates.title'));
  }, [changePreferencesPageTitle]);

  // Select the first template and its first variant once they load.
  useEffect(() => {
    if (!templateKey && templates?.length) {
      setTemplateKey(templates[0].key);
      setVariant(templates[0].variants[0]?.key);
    }
  }, [templates, templateKey]);

  const template = templates?.find((t) => t.key === templateKey);
  const summary = plan?.summary;
  const hasChanges =
    !!summary && summary.update + summary.create + summary.remove > 0;
  // A failed refetch keeps the last plan on screen; it may be stale.
  const canApply =
    !!plan &&
    !isPreviewing &&
    !isPreviewFailed &&
    plan.errors.length === 0 &&
    hasChanges;

  const handleTemplateChange = (key: string) => {
    const next = templates?.find((t) => t.key === key);
    setTemplateKey(key);
    setVariant(next?.variants[0]?.key);
  };

  const handleApply = () => {
    applyTemplate({ templateKey: templateKey!, variant })
      .then((applied) => {
        AppToaster.show({
          message: intl.get('accounts_templates.applied', {
            ...applied.summary,
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: ApiError) => {
        // The chart changed after the preview; the refreshed preview lists
        // the conflicts.
        const [first] =
          (error?.data?.errors as Array<{ message?: string }> | undefined) ??
          [];
        AppToaster.show({
          message: first?.message ?? intl.get('something_went_wrong'),
          intent: Intent.DANGER,
        });
      })
      .finally(() => setIsConfirming(false));
  };

  return (
    <div
      className={classNames(
        CLASSES.PREFERENCES_PAGE_INSIDE_CONTENT,
        'preferences-page__inside-content--chart-of-accounts',
      )}
    >
      <PageCard>
        {isLoading ? (
          <PreferencesPageLoader />
        ) : (
          <>
            <Intro>{intl.get('accounts_templates.intro')}</Intro>

            <FormGroup
              label={<strong>{intl.get('accounts_templates.template')}</strong>}
            >
              <HTMLSelect
                value={templateKey}
                onChange={(event) =>
                  handleTemplateChange(event.currentTarget.value)
                }
                options={(templates ?? []).map((t) => ({
                  value: t.key,
                  label: t.name,
                }))}
              />
              {template && (
                <TemplateDescription>
                  {template.description}
                </TemplateDescription>
              )}
            </FormGroup>

            {template && template.variants.length > 0 && (
              <FormGroup
                label={
                  <strong>{intl.get('accounts_templates.variant')}</strong>
                }
              >
                <RadioGroup
                  selectedValue={variant}
                  onChange={(event) => setVariant(event.currentTarget.value)}
                >
                  {template.variants.map((v) => (
                    <Radio key={v.key} value={v.key} label={v.name} />
                  ))}
                </RadioGroup>
              </FormGroup>
            )}

            {isPreviewFailed && (
              <Callout intent={Intent.DANGER}>
                {intl.get('accounts_templates.preview_failed')}
              </Callout>
            )}
            {plan && <AccountsTemplateChanges plan={plan} />}

            <CardFooterActions>
              <Button
                intent={Intent.PRIMARY}
                disabled={!canApply}
                loading={isPreviewing && !plan}
                onClick={() => setIsConfirming(true)}
              >
                {intl.get('accounts_templates.apply')}
              </Button>
            </CardFooterActions>

            <Alert
              isOpen={isConfirming}
              intent={Intent.PRIMARY}
              icon="warning-sign"
              loading={isApplying}
              confirmButtonText={intl.get('accounts_templates.apply')}
              cancelButtonText={intl.get('cancel')}
              onConfirm={handleApply}
              onCancel={() => setIsConfirming(false)}
            >
              <p>
                {intl.get('accounts_templates.confirm', {
                  template: template?.name ?? '',
                  ...summary,
                })}
              </p>
            </Alert>
          </>
        )}
      </PageCard>
    </div>
  );
}

export const ChartOfAccountsPreferences = FF.pipe(
  ChartOfAccountsPreferencesInner,
  withDashboardActions,
);

const PageCard = styled(Card)`
  padding: 25px;
`;

const Intro = styled.p`
  max-width: 720px;
  margin-bottom: 20px;
`;

const TemplateDescription = styled.div`
  margin-top: 6px;
  max-width: 720px;
  opacity: 0.75;
`;
