import { Callout, HTMLTable, Intent, Switch, Tag } from '@blueprintjs/core';
import React, { useMemo, useState } from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import type {
  AccountsTemplateChange,
  AccountsTemplateIssue,
  AccountsTemplatePlan,
} from '@bigcapital/sdk-ts';
import { useAccountsTypes } from '@/hooks/query';

const ACTION_INTENT: Record<AccountsTemplateChange['action'], Intent> = {
  update: Intent.PRIMARY,
  create: Intent.SUCCESS,
  remove: Intent.DANGER,
  unchanged: Intent.NONE,
};

interface AccountsTemplateChangesProps {
  plan: AccountsTemplatePlan;
}

/**
 * The preview of a template: what blocks it, what it skips, and every account
 * it would change.
 */
export function AccountsTemplateChanges({
  plan,
}: AccountsTemplateChangesProps) {
  const [showUnchanged, setShowUnchanged] = useState(false);
  const { data: accountTypes } = useAccountsTypes();

  const typeLabels = useMemo(
    () =>
      new Map(
        (accountTypes ?? []).map((type: { key: string; label: string }) => [
          type.key,
          type.label,
        ]),
      ),
    [accountTypes],
  );
  const changes = plan.changes.filter(
    (change) => showUnchanged || change.action !== 'unchanged',
  );
  const { summary } = plan;

  return (
    <>
      <Issues
        intent={Intent.DANGER}
        title={intl.get('accounts_templates.errors_title')}
        issues={plan.errors}
      />
      <Issues
        intent={Intent.WARNING}
        title={intl.get('accounts_templates.warnings_title')}
        issues={plan.warnings}
      />

      <SummaryRow>
        <span>
          {summary.update + summary.create + summary.remove === 0
            ? intl.get('accounts_templates.no_changes')
            : intl.get('accounts_templates.summary', { ...summary })}
        </span>
        <Switch
          checked={showUnchanged}
          label={intl.get('accounts_templates.show_unchanged')}
          onChange={() => setShowUnchanged(!showUnchanged)}
        />
      </SummaryRow>

      {changes.length > 0 && (
        <ChangesTable condensed striped>
          <thead>
            <tr>
              <th>{intl.get('accounts_templates.column.action')}</th>
              <th>{intl.get('accounts_templates.column.code')}</th>
              <th>{intl.get('accounts_templates.column.name')}</th>
              <th>{intl.get('accounts_templates.column.type')}</th>
              <th>{intl.get('accounts_templates.column.parent')}</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((change, index) => (
              <tr key={`${change.accountId ?? change.templateCode}-${index}`}>
                <td>
                  <Tag minimal intent={ACTION_INTENT[change.action]}>
                    {intl.get(`accounts_templates.action.${change.action}`)}
                  </Tag>
                </td>
                <td>
                  <Diff
                    before={change.before?.code}
                    after={change.after?.code}
                    removed={change.action === 'remove'}
                  />
                </td>
                <td>
                  <Diff
                    before={change.before?.name}
                    after={change.after?.name}
                    removed={change.action === 'remove'}
                  />
                </td>
                <td>
                  {typeLabels.get(change.accountType) ?? change.accountType}
                </td>
                <td>{(change.after ?? change.before)?.parentName ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </ChangesTable>
      )}
    </>
  );
}

interface IssuesProps {
  intent: Intent;
  title: string;
  issues: AccountsTemplateIssue[];
}

function Issues({ intent, title, issues }: IssuesProps) {
  if (issues.length === 0) return null;

  return (
    <IssuesCallout intent={intent} title={title}>
      <ul>
        {issues.map((issue, index) => (
          <li key={index}>{issue.message}</li>
        ))}
      </ul>
    </IssuesCallout>
  );
}

interface DiffProps {
  before?: string | null;
  after?: string | null;
  removed?: boolean;
}

/**
 * Shows a value, or the old value struck through beside the new one.
 */
function Diff({ before, after, removed }: DiffProps) {
  if (removed) return <Old>{before}</Old>;
  if (before == null || before === after) return <>{after}</>;

  return (
    <>
      <Old>{before}</Old> {after}
    </>
  );
}

const IssuesCallout = styled(Callout)`
  margin-bottom: 16px;

  ul {
    margin: 6px 0 0;
    padding-left: 18px;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  .bp4-control {
    margin-bottom: 0;
  }
`;

const ChangesTable = styled(HTMLTable)`
  width: 100%;
`;

const Old = styled.span`
  text-decoration: line-through;
  opacity: 0.6;
`;
