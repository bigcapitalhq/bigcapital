import { Button, Divider, Intent } from '@blueprintjs/core';
import { Form, useFormikContext } from 'formik';
import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import {
  CardFooterActions,
  FFormGroup,
  FInputGroup,
  FSwitch,
  FormattedMessage as T,
} from '@/components';
import { transactionNumber } from '@/utils';

export interface ContactsPreferencesFormValues {
  customerAutoIncrement: boolean;
  customerNumberPrefix: string;
  customerNextNumber: string;
  vendorAutoIncrement: boolean;
  vendorNumberPrefix: string;
  vendorNextNumber: string;
}

/**
 * Contacts number preferences form.
 */
export function ContactsPreferencesForm(): React.ReactElement {
  const history = useHistory();
  const { isSubmitting, values } =
    useFormikContext<ContactsPreferencesFormValues>();

  const handleCloseClick = () => {
    history.go(-1);
  };

  return (
    <Form>
      <Hint>
        <T id={'pref.contacts.existing_records_hint'} />
      </Hint>

      <SectionTitle>
        <T id={'pref.contacts.customers.title'} />
      </SectionTitle>

      <ContactsFormGroup name={'customerAutoIncrement'} inline={true}>
        <FSwitch
          name={'customerAutoIncrement'}
          labelElement={<T id={'pref.contacts.auto_increment'} />}
          large={true}
        />
      </ContactsFormGroup>

      {values.customerAutoIncrement && (
        <>
          <ContactsFormGroup
            name={'customerNumberPrefix'}
            label={<T id={'pref.contacts.number_prefix'} />}
            helperText={<T id={'pref.contacts.number_prefix_hint'} />}
          >
            <FInputGroup name={'customerNumberPrefix'} />
          </ContactsFormGroup>

          <ContactsFormGroup
            name={'customerNextNumber'}
            label={<T id={'pref.contacts.next_number'} />}
            helperText={<T id={'pref.contacts.next_number_hint'} />}
          >
            <FInputGroup name={'customerNextNumber'} />
          </ContactsFormGroup>

          <Preview>
            <T
              id={'pref.contacts.next_number_preview'}
              values={{
                code: transactionNumber(
                  values.customerNumberPrefix,
                  values.customerNextNumber,
                ),
              }}
            />
          </Preview>
        </>
      )}

      <Divider style={{ margin: '24px 0' }} />

      <SectionTitle>
        <T id={'pref.contacts.vendors.title'} />
      </SectionTitle>

      <ContactsFormGroup name={'vendorAutoIncrement'} inline={true}>
        <FSwitch
          name={'vendorAutoIncrement'}
          labelElement={<T id={'pref.contacts.auto_increment'} />}
          large={true}
        />
      </ContactsFormGroup>

      {values.vendorAutoIncrement && (
        <>
          <ContactsFormGroup
            name={'vendorNumberPrefix'}
            label={<T id={'pref.contacts.number_prefix'} />}
            helperText={<T id={'pref.contacts.number_prefix_hint'} />}
          >
            <FInputGroup name={'vendorNumberPrefix'} />
          </ContactsFormGroup>

          <ContactsFormGroup
            name={'vendorNextNumber'}
            label={<T id={'pref.contacts.next_number'} />}
            helperText={<T id={'pref.contacts.next_number_hint'} />}
          >
            <FInputGroup name={'vendorNextNumber'} />
          </ContactsFormGroup>

          <Preview>
            <T
              id={'pref.contacts.next_number_preview'}
              values={{
                code: transactionNumber(
                  values.vendorNumberPrefix,
                  values.vendorNextNumber,
                ),
              }}
            />
          </Preview>
        </>
      )}

      <CardFooterActions>
        <Button intent={Intent.PRIMARY} loading={isSubmitting} type="submit">
          <T id={'save'} />
        </Button>
        <Button onClick={handleCloseClick} disabled={isSubmitting}>
          <T id={'close'} />
        </Button>
      </CardFooterActions>
    </Form>
  );
}

const ContactsFormGroup = styled(FFormGroup)`
  max-width: 400px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 16px;
`;

const Preview = styled.div`
  margin-top: 8px;
  font-size: 13px;
  opacity: 0.7;
`;

const Hint = styled.div`
  margin-bottom: 20px;
  font-size: 13px;
  opacity: 0.7;
`;
