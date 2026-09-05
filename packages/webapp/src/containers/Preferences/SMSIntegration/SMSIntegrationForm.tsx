import { Intent, Button, Callout } from '@blueprintjs/core';
import { flatten, unflatten } from 'flat';
import { Formik, Form, FormikHelpers } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import styled from 'styled-components';
import { SMSIntegrationFormSchema } from './SMSIntegrationForm.schema';
import { useSMSIntegrationContext } from './SMSIntegrationProvider';
import type { SMSIntegrationFormValues } from './types';
import {
  AppToaster,
  CardFooterActions,
  FFormGroup,
  FInputGroup,
  FormattedMessage as T,
} from '@/components';
import { transformToForm } from '@/utils';

const defaultFormValues: SMSIntegrationFormValues = {
  smsIntegration: {
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioFromNumber: '',
    isEnvCredentialsActive: false,
  },
};

/**
 * SMS Integration form.
 */
export function SMSIntegrationForm(): React.ReactElement {
  const { allSettings, saveSettingMutate } = useSMSIntegrationContext();

  const allSettingsFlat = (allSettings ? flatten(allSettings) : {}) as Record<
    string,
    unknown
  >;
  const defaultFormValuesFlat = flatten(defaultFormValues) as Record<
    string,
    unknown
  >;
  const initialValues = unflatten({
    ...defaultFormValuesFlat,
    ...transformToForm(allSettingsFlat, defaultFormValuesFlat),
  }) as SMSIntegrationFormValues;

  const handleFormSubmit = (
    values: SMSIntegrationFormValues,
    { setSubmitting }: FormikHelpers<SMSIntegrationFormValues>,
  ) => {
    const options = [
      {
        group: 'sms-integration',
        key: 'twilio_account_sid',
        value: values.smsIntegration.twilioAccountSid ?? '',
      },
      {
        group: 'sms-integration',
        key: 'twilio_auth_token',
        value: values.smsIntegration.twilioAuthToken ?? '',
      },
      {
        group: 'sms-integration',
        key: 'twilio_from_number',
        value: values.smsIntegration.twilioFromNumber ?? '',
      },
    ];
    setSubmitting(true);

    const onSuccess = () => {
      AppToaster.show({
        message: intl.get('sms_integration.saved_success_message'),
        intent: Intent.SUCCESS,
      });
      setSubmitting(false);
    };
    const onError = () => {
      setSubmitting(false);
    };
    saveSettingMutate({ options }).then(onSuccess).catch(onError);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={SMSIntegrationFormSchema}
      onSubmit={handleFormSubmit}
      enableReinitialize={true}
    >
      {({ isSubmitting, values }) => (
        <FormRoot>
          {values.smsIntegration.isEnvCredentialsActive && (
            <Callout intent={Intent.SUCCESS}>
              <T id={'sms_integration.env_credentials_active'} />
            </Callout>
          )}

          <FFormGroup
            name={'smsIntegration.twilioAccountSid'}
            label={intl.get('sms_integration.twilio_account_sid')}
          >
            <FInputGroup name={'smsIntegration.twilioAccountSid'} />
          </FFormGroup>

          <FFormGroup
            name={'smsIntegration.twilioAuthToken'}
            label={intl.get('sms_integration.twilio_auth_token')}
          >
            <FInputGroup
              name={'smsIntegration.twilioAuthToken'}
              type={'password'}
            />
          </FFormGroup>

          <FFormGroup
            name={'smsIntegration.twilioFromNumber'}
            label={intl.get('sms_integration.twilio_from_number')}
          >
            <FInputGroup name={'smsIntegration.twilioFromNumber'} />
          </FFormGroup>

          <CardFooterActions>
            <Button
              intent={Intent.PRIMARY}
              loading={isSubmitting}
              type="submit"
            >
              <T id={'save'} />
            </Button>
          </CardFooterActions>
        </FormRoot>
      )}
    </Formik>
  );
}

const FormRoot = styled(Form)`
  padding: 25px;
`;
