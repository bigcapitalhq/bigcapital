import { Button, Card, Intent, Tab, Tabs } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { CustomFieldsDeleteAlert } from './CustomFieldsDeleteAlert';
import { CustomFieldsFormDialog } from './CustomFieldsFormDialog';
import { CustomFieldsTable } from './CustomFieldsTable';
import type { WithDashboardActionsProps } from '@/containers/Dashboard/withDashboardActions';
import type { CustomField } from '@bigcapital/sdk-ts';
import { AppToaster, Box } from '@/components';
import { CUSTOM_FIELD_RESOURCES } from '@/constants/customFields';
import { withDashboardActions } from '@/containers/Dashboard/withDashboardActions';
import { useCustomFields, useUpdateCustomFieldStatus } from '@/hooks/query';

type CustomFieldsPreferencesInnerProps = Pick<
  WithDashboardActionsProps,
  'changePreferencesPageTitle'
>;

function CustomFieldsPreferencesInner({
  changePreferencesPageTitle,
}: CustomFieldsPreferencesInnerProps) {
  const [resource, setResource] = React.useState<
    (typeof CUSTOM_FIELD_RESOURCES)[number]['value']
  >(CUSTOM_FIELD_RESOURCES[0].value);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingField, setEditingField] = React.useState<CustomField | null>(
    null,
  );
  const [deletingField, setDeletingField] = React.useState<CustomField | null>(
    null,
  );
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  const { data, isLoading, isFetching } = useCustomFields({
    resourceName: resource,
    includeInactive: true,
  });
  const { mutateAsync: updateStatus } = useUpdateCustomFieldStatus();

  const customFields = React.useMemo(
    () => (data?.data ?? []) as CustomField[],
    [data],
  );

  React.useEffect(() => {
    changePreferencesPageTitle(intl.get('custom_fields.page.title'));
  }, [changePreferencesPageTitle]);

  const handleNewField = () => {
    setEditingField(null);
    setIsFormOpen(true);
  };

  const handleEditField = (field: CustomField) => {
    setEditingField(field);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingField(null);
  };

  const handleToggleActive = (field: CustomField) => {
    updateStatus([field.id, { active: !field.active }])
      .then(() => {
        AppToaster.show({
          message: intl.get(
            field.active
              ? 'custom_fields.message.deactivated'
              : 'custom_fields.message.activated',
          ),
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {
        AppToaster.show({
          message: intl.get('something_went_wrong'),
          intent: Intent.DANGER,
        });
      });
  };

  const handleDeleteField = (field: CustomField) => {
    setDeletingField(field);
    setIsDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
    setDeletingField(null);
  };

  const selectedResourceLabel = intl.get(
    CUSTOM_FIELD_RESOURCES.find((item) => item.value === resource)?.labelKey ??
      resource,
  );

  return (
    <CustomFieldsPageRoot>
      <Card className={'custom-fields-card'}>
        <Tabs
          selectedTabId={resource}
          onChange={(tabId) =>
            setResource(
              String(tabId) as (typeof CUSTOM_FIELD_RESOURCES)[number]['value'],
            )
          }
          vertical={false}
        >
          {CUSTOM_FIELD_RESOURCES.map((resourceItem) => (
            <Tab
              key={resourceItem.value}
              id={resourceItem.value}
              title={intl.get(resourceItem.labelKey)}
            />
          ))}
        </Tabs>

        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
          py={15}
        >
          <div>
            <strong>{selectedResourceLabel}</strong>
            <p className={'text-muted'} style={{ margin: '4px 0 0' }}>
              {intl.get('custom_fields.page.description')}
            </p>
          </div>
          <Button
            intent={Intent.PRIMARY}
            icon={'plus'}
            text={intl.get('custom_fields.action.new')}
            onClick={handleNewField}
          />
        </Box>

        {customFields.length === 0 && !isLoading ? (
          <EmptyStatus>
            <h3>{intl.get('custom_fields.empty.title')}</h3>
            <p>{intl.get('custom_fields.empty.description')}</p>
            <Button
              intent={Intent.PRIMARY}
              icon={'plus'}
              text={intl.get('custom_fields.action.new')}
              onClick={handleNewField}
            />
          </EmptyStatus>
        ) : (
          <CustomFieldsTable
            customFields={customFields}
            isLoading={isLoading}
            isFetching={isFetching}
            onEdit={handleEditField}
            onToggleActive={handleToggleActive}
            onDelete={handleDeleteField}
          />
        )}
      </Card>

      <CustomFieldsFormDialog
        isOpen={isFormOpen}
        resource={resource}
        customField={editingField}
        onClose={handleCloseForm}
      />
      <CustomFieldsDeleteAlert
        field={deletingField}
        isOpen={isDeleteOpen}
        onClose={handleCloseDelete}
      />
    </CustomFieldsPageRoot>
  );
}

const CustomFieldsPageRoot = styled.div`
  .custom-fields-card {
    padding: 0;
  }
  .custom-fields-card .bp4-tabs {
    padding: 20px 20px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }
  .custom-fields-card .bp4-tab-list {
    margin-bottom: 0;
  }
  .custom-fields-card > div > div:nth-child(2) {
    padding: 0 20px;
  }
`;

const EmptyStatus = styled.div`
  padding: 50px 20px;
  text-align: center;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  h3 {
    margin-bottom: 8px;
  }
  p {
    color: #5f6b7c;
    margin-bottom: 20px;
  }
`;

export const CustomFieldsPreferences = FF.pipe(
  CustomFieldsPreferencesInner,
  withDashboardActions,
);
