import { Button, Tabs, Tab, Position } from '@blueprintjs/core';
import { SelectOptionProps } from '@blueprintjs-formik/select';
import { Formik, Form, FormikHelpers } from 'formik';
import moment from 'moment';
import { useMemo } from 'react';
import styled from 'styled-components';
import { FinancialStatementHeader } from '../FinancialStatementHeader';
import { getDefaultAuditLogQuery, getAuditLogQuerySchema } from './common';
import { FormattedMessage as T, FFormGroup, FDateInput } from '@/components';
import { FMultiSelect } from '@/components/Forms';
import { useAuditLogFilterOptionsQuery } from '@/hooks/query';
import { saveInvoke, transformToForm } from '@/utils';

interface AuditLogHeaderFormValues {
  subject: string[];
  action: string[];
  fromDate: Date | string;
  toDate: Date | string;
}

interface AuditLogHeaderProps {
  onSubmitFilter: (values: Record<string, unknown>) => void;
  pageFilter: Record<string, unknown>;
  isFilterDrawerOpen: boolean;
  toggleFilterDrawer: (toggle?: boolean) => void;
}

function normalizeStringListField(value: unknown): string[] {
  if (Array.isArray(value)) return value;
  return value ? [value as string] : [];
}

interface SelectItem extends SelectOptionProps {
  value: string;
  name: string;
}

const auditLogSelectItemPredicate = (query: string, item: SelectItem) => {
  const q = (query || '').toLowerCase();
  const name = (item?.name ?? '').toLowerCase();
  return name.includes(q);
};

const AuditLogDrawerHeader = styled(FinancialStatementHeader)`
  .bp4-drawer {
    max-height: 350px;
  }
`;

/**
 * Audit Log Header - Filter drawer
 */
export function AuditLogHeader({
  onSubmitFilter,
  pageFilter,
  isFilterDrawerOpen,
  toggleFilterDrawer,
}: AuditLogHeaderProps) {
  const { data: filterOptions, isLoading: isFilterOptionsLoading } =
    useAuditLogFilterOptionsQuery({
      enabled: isFilterDrawerOpen,
    }) as {
      data: {
        subjects: { key: string; label: string }[];
        actions: { key: string; label: string }[];
      };
      isLoading: boolean;
    };

  const subjectSelectItems = useMemo(() => {
    const byValue = new Map<string, SelectItem>();
    for (const s of filterOptions?.subjects ?? []) {
      byValue.set(s.key, { value: s.key, name: s.label });
    }
    for (const s of normalizeStringListField(pageFilter.subject)) {
      if (s && !byValue.has(s)) {
        byValue.set(s, { value: s, name: s });
      }
    }
    return Array.from(byValue.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [filterOptions?.subjects, pageFilter.subject]);

  const actionSelectItems = useMemo(() => {
    const byValue = new Map<string, SelectItem>();
    for (const a of filterOptions?.actions ?? []) {
      byValue.set(a.key, { value: a.key, name: a.label });
    }
    for (const act of normalizeStringListField(pageFilter.action)) {
      if (act && !byValue.has(act)) {
        byValue.set(act, { value: act, name: act });
      }
    }
    return Array.from(byValue.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [filterOptions?.actions, pageFilter.action]);

  const defaultValues = getDefaultAuditLogQuery();

  const initialValues = transformToForm(
    {
      ...defaultValues,
      ...pageFilter,
      fromDate: pageFilter.fromDate
        ? moment(pageFilter.fromDate as string).toDate()
        : '',
      toDate: pageFilter.toDate
        ? moment(pageFilter.toDate as string).toDate()
        : '',
    },
    defaultValues,
  ) as AuditLogHeaderFormValues;

  const validationSchema = getAuditLogQuerySchema();

  const handleSubmit = (
    values: AuditLogHeaderFormValues,
    { setSubmitting }: FormikHelpers<AuditLogHeaderFormValues>,
  ) => {
    const parsedFilter = {
      ...values,
      subject: normalizeStringListField(values.subject),
      action: normalizeStringListField(values.action),
      fromDate: values.fromDate
        ? moment(values.fromDate as Date).format('YYYY-MM-DD')
        : '',
      toDate: values.toDate
        ? moment(values.toDate as Date).format('YYYY-MM-DD')
        : '',
    };
    saveInvoke(onSubmitFilter, parsedFilter);
    toggleFilterDrawer(false);
    setSubmitting(false);
  };

  const handleCancelClick = () => {
    toggleFilterDrawer(false);
  };

  const handleDrawerClose = () => {
    toggleFilterDrawer(false);
  };

  return (
    <AuditLogDrawerHeader
      isOpen={isFilterDrawerOpen}
      drawerProps={{ onClose: handleDrawerClose }}
    >
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        <Form>
          <Tabs animate={true} vertical={true} renderActiveTabPanelOnly={true}>
            <Tab
              id="general"
              title={<T id={'general'} />}
              panel={
                <div style={{ maxWidth: '400px' }}>
                  <FFormGroup name="subject" label={'Subject'} fastField>
                    <FMultiSelect
                      name="subject"
                      items={subjectSelectItems}
                      valueAccessor="value"
                      textAccessor="name"
                      tagAccessor="name"
                      itemPredicate={auditLogSelectItemPredicate}
                      placeholder={'All'}
                      popoverProps={{ minimal: true }}
                      tagInputProps={{
                        inputProps: { disabled: isFilterOptionsLoading },
                      }}
                      fill
                      resetOnSelect
                      fastField
                    />
                  </FFormGroup>

                  <FFormGroup name="action" label={'Action'} fastField>
                    <FMultiSelect
                      name="action"
                      items={actionSelectItems}
                      valueAccessor="value"
                      textAccessor="name"
                      tagAccessor="name"
                      itemPredicate={auditLogSelectItemPredicate}
                      placeholder={'All'}
                      popoverProps={{ minimal: true }}
                      tagInputProps={{
                        inputProps: { disabled: isFilterOptionsLoading },
                      }}
                      fill
                      resetOnSelect
                      fastField
                    />
                  </FFormGroup>

                  <FFormGroup name="fromDate" label={'From'} fastField>
                    <FDateInput
                      name="fromDate"
                      popoverProps={{
                        position: Position.BOTTOM,
                        minimal: true,
                      }}
                      formatDate={(date: Date) => date.toLocaleDateString()}
                      parseDate={(str: string) => new Date(str)}
                      inputProps={{ fill: true }}
                      fastField
                    />
                  </FFormGroup>

                  <FFormGroup name="toDate" label={'To'} fastField>
                    <FDateInput
                      name="toDate"
                      type="date"
                      popoverProps={{
                        position: Position.BOTTOM,
                        minimal: true,
                      }}
                      formatDate={(date: Date) => date.toLocaleDateString()}
                      parseDate={(str: string) => new Date(str)}
                      inputProps={{ fill: true }}
                      fastField
                    />
                  </FFormGroup>
                </div>
              }
            />
          </Tabs>

          <div className="financial-header-drawer__footer">
            <Button className={'mr1'} intent="primary" type="submit">
              <T id={'calculate_report'} />
            </Button>
            <Button onClick={handleCancelClick} minimal={true}>
              <T id={'cancel'} />
            </Button>
          </div>
        </Form>
      </Formik>
    </AuditLogDrawerHeader>
  );
}
