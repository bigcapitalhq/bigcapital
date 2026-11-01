import { getAllCountries } from '@bigcapital/utils';
import { Button, Intent, Classes } from '@blueprintjs/core';
import { x } from '@xstyled/emotion';
import { Formik, Form, FormikHelpers } from 'formik';
import { ApiError } from 'openapi-typescript-fetch';
import React from 'react';
import intl from 'react-intl-universal';
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
import { getAllCurrenciesOptions } from '@/constants/currencies';
import { getFiscalYear } from '@/constants/fiscalYearOptions';
import { getLanguages } from '@/constants/languagesOptions';
import {
  getSetupOrganizationValidation,
  type SetupOrganizationFormValues,
} from '@/containers/Setup/SetupOrganization.schema';
import { useCreateWorkspace } from '@/ee/workspaces/hooks/query';
import { useIsDarkMode } from '@/hooks/useDarkMode';

/** Blueprint FormGroup supports `fastField`; package typings omit it. */
type FFormGroupWithFastField = typeof FFormGroup & {
  (
    props: React.ComponentProps<typeof FFormGroup> & { fastField?: boolean },
  ): JSX.Element;
};
const FFormGroupField = FFormGroup as FFormGroupWithFastField;

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
      const result = await createWorkspaceMutate(values);
      setSubmitting(false);
      onSubmitting({
        organizationId: result.organizationId,
        jobId: result.jobId,
      });
    } catch (error: unknown) {
      setSubmitting(false);
      if (
        error instanceof ApiError &&
        error.data &&
        typeof error.data === 'object' &&
        'errors' in error.data
      ) {
        const { errors } = error.data as {
          errors: Record<string, string>;
        };
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
                <FFormGroupField
                  name={'name'}
                  label={intl.get('legal_organization_name')}
                  fastField
                >
                  <FInputGroup name={'name'} large fastField />
                </FFormGroupField>

                {/* ---------- Location ---------- */}
                <FFormGroupField
                  name={'location'}
                  label={intl.get('business_location')}
                  fastField={true}
                >
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
                    <FFormGroupField
                      name={'baseCurrency'}
                      label={intl.get('base_currency')}
                      fastField={true}
                    >
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
                    <FFormGroupField
                      name={'language'}
                      label={intl.get('language')}
                      fastField
                    >
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
                <FFormGroupField
                  name={'fiscalYear'}
                  label={intl.get('fiscal_year')}
                  fastField
                >
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
                <FFormGroupField
                  name={'timezone'}
                  label={intl.get('time_zone')}
                >
                  <FTimezoneSelect
                    name={'timezone'}
                    valueDisplayFormat="composite"
                    showLocalTimezone={true}
                    placeholder={
                      (<T id={'select_time_zone'} />) as unknown as string
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
                  <T
                    id={
                      'setup.organization.note_you_can_change_your_preferences'
                    }
                  />
                </x.p>
              </Form>
            </x.div>
          </x.div>

          <x.div
            borderTop={'1px solid rgba(255, 255, 255, 0.1)'}
            pt={'12px'}
            pb={'12px'}
          >
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
