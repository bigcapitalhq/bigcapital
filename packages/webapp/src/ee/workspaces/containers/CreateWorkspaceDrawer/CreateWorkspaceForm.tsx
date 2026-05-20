import React from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { Button, Intent, Classes } from '@blueprintjs/core';
import { getAllCountries } from '@bigcapital/utils';
import { isAxiosError } from 'axios';
import { x } from '@xstyled/emotion';
import {
  Col,
  Row,
  FFormGroup,
  FInputGroup,
  FSelect,
  FTimezoneSelect,
  FormattedMessage as T,
  DrawerBody,
  DrawerActionsBar,
} from '@/components';

/** Blueprint FormGroup supports `fastField`; package typings omit it. */
type FFormGroupWithFastField = typeof FFormGroup & {
  (props: React.ComponentProps<typeof FFormGroup> & { fastField?: boolean }): JSX.Element;
};
const FFormGroupField = FFormGroup as FFormGroupWithFastField;
import { useIsDarkMode } from '@/hooks/useDarkMode';
import {
  useCreateWorkspace,
  type CreateWorkspaceRequest,
} from '@/ee/workspaces/hooks/query/workspaces';
import { getFiscalYear } from '@/constants/fiscalYearOptions';
import { getLanguages } from '@/constants/languagesOptions';
import { getAllCurrenciesOptions } from '@/constants/currencies';
import {
  getSetupOrganizationValidation,
  type SetupOrganizationFormValues,
} from '@/containers/Setup/SetupOrganization.schema';
import { transfromToSnakeCase } from '@/utils';

const countries = getAllCountries();

const defaultValues: SetupOrganizationFormValues = {
  name: '',
  location: '',
  baseCurrency: '',
  language: 'en',
  fiscalYear: '',
  timezone: '',
};

export interface CreatedWorkspaceSubmitPayload {
  organizationId: string;
  jobId: string;
}

interface CreateWorkspaceFormProps {
  onSubmitting: (data: CreatedWorkspaceSubmitPayload) => void;
  onCancel: () => void;
}

/**
 * Create workspace form.
 */
export default function CreateWorkspaceForm({
  onSubmitting,
  onCancel,
}: CreateWorkspaceFormProps) {
  const FiscalYear = getFiscalYear();
  const Languages = getLanguages();
  const currencies = getAllCurrenciesOptions();
  const isDarkMode = useIsDarkMode();
  const { mutateAsync: createWorkspaceMutate } = useCreateWorkspace();
  const validationSchema = getSetupOrganizationValidation();

  const handleSubmit = async (
    values: SetupOrganizationFormValues,
    { setSubmitting, setErrors }: FormikHelpers<SetupOrganizationFormValues>,
  ) => {
    try {
      const payload = transfromToSnakeCase(
        values,
      ) as CreateWorkspaceRequest;
      const result = await createWorkspaceMutate(payload);
      setSubmitting(false);
      onSubmitting({
        organizationId: result.organizationId,
        jobId: result.jobId,
      });
    } catch (error: unknown) {
      setSubmitting(false);
      if (
        isAxiosError(error) &&
        error.response?.data &&
        typeof error.response.data === 'object' &&
        error.response.data !== null &&
        'errors' in error.response.data
      ) {
        const { errors } = error.response.data as { errors: Record<string, string> };
        if (errors && typeof errors === 'object') {
          setErrors(errors);
        }
      }
    }
  };

  return (
    <Formik<SetupOrganizationFormValues>
      validationSchema={validationSchema}
      initialValues={{ ...defaultValues }}
      onSubmit={handleSubmit}
    >
      {(formikProps) => (
        <>
        <x.div flex={1} pt={'22px'} overflow={'auto'}>
            <x.div maxWidth={'600px'} w="100%" mx="auto">
              <Form>
                {/* ---------- Organization name ----------  */}
                <FFormGroupField name={'name'} label={<T id={'legal_organization_name'} />} fastField>
                  <FInputGroup name={'name'} large fastField />
                </FFormGroupField>

                {/* ---------- Location ---------- */}
                <FFormGroupField name={'location'} label={<T id={'business_location'} />} fastField={true}>
                  <FSelect
                    name={'location'}
                    items={countries}
                    valueAccessor={'countryCode'}
                    textAccessor={'name'}
                    placeholder={<T id={'select_business_location'} />}
                    popoverProps={{ minimal: true }}
                    buttonProps={{ large: true }}
                    fastField
                  />
                </FFormGroupField>

                <Row bsPrefix="row" className="" noGutters={false}>
                  <Col xs={6} bsPrefix="col" className="" noGutters={false}>
                    {/* ----------  Base currency ----------  */}
                    <FFormGroupField name={'baseCurrency'} label={<T id={'base_currency'} />} fastField={true}>
                      <FSelect
                        name={'baseCurrency'}
                        items={currencies}
                        popoverProps={{ minimal: true }}
                        valueAccessor={'key'}
                        textAccessor={'name'}
                        placeholder={<T id={'select_base_currency'} />}
                        buttonProps={{ large: true }}
                        fastField
                      />
                    </FFormGroupField>
                  </Col>

                  {/* ---------- Language ---------- */}
                  <Col xs={6} bsPrefix="col" className="" noGutters={false}>
                    <FFormGroupField name={'language'} label={<T id={'language'} />} fastField>
                      <FSelect
                        name={'language'}
                        items={Languages}
                        valueAccessor={'value'}
                        textAccessor={'name'}
                        placeholder={<T id={'select_language'} />}
                        popoverProps={{ minimal: true }}
                        buttonProps={{ large: true }}
                        fastField
                      />
                    </FFormGroupField>
                  </Col>
                </Row>

                {/* --------- Fiscal Year ----------- */}
                <FFormGroupField name={'fiscalYear'} label={<T id={'fiscal_year'} />} fastField>
                  <FSelect
                    name={'fiscalYear'}
                    items={FiscalYear}
                    valueAccessor={'key'}
                    textAccessor={'name'}
                    placeholder={<T id={'select_fiscal_year'} />}
                    popoverProps={{ minimal: true }}
                    buttonProps={{ large: true }}
                    fastField
                  />
                </FFormGroupField>

                {/* ----------  Time zone ----------  */}
                <FFormGroupField name={'timezone'} label={<T id={'time_zone'} />}>
                  <FTimezoneSelect
                    name={'timezone'}
                    valueDisplayFormat="composite"
                    showLocalTimezone={true}
                    placeholder={
                      <T id={'select_time_zone'} /> as unknown as string
                    }
                    popoverProps={{ minimal: true }}
                    buttonProps={{
                      alignText: 'left',
                      fill: true,
                      large: true,
                    }}
                  />
                </FFormGroupField>

                <x.p fontSize={12} mb={6} className={Classes.TEXT_MUTED}>
                  <T id={'setup.organization.note_you_can_change_your_preferences'} />
                </x.p>
              </Form>
            </x.div>
          </x.div>

          <x.div borderTop={"1px solid rgba(255, 255, 255, 0.1)"} pt={'12px'} pb={'12px'}>
            <x.div
              display="flex"
              justifyContent="flex-end"
              gap="10px"
              w="100%"
              maxWidth="600px"
              mx="auto"
              px="25px"
            >
              <Button onClick={onCancel}>
                <T id={'cancel'} />
              </Button>

              <Button
                intent={Intent.PRIMARY}
                loading={formikProps.isSubmitting}
                type="submit"
                onClick={() => {
                  formikProps.handleSubmit();
                }}
              >
                <T id={'workspaces.create_workspace'} />
              </Button>
            </x.div>
          </x.div>
        </>
      )}
    </Formik>
  );
}
