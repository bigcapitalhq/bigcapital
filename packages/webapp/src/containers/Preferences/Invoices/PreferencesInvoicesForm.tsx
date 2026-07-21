// @ts-nocheck
import { Button, Intent } from '@blueprintjs/core';
import { Form } from 'formik';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { FormattedMessage as T, FFormGroup, FTextArea } from '@/components';

export interface PreferencesInvoicesFormProps {
  isSubmitting: boolean;
}

/**
 * Invoices preferences form.
 */
export function PreferencesInvoicesForm({
  isSubmitting,
}: PreferencesInvoicesFormProps) {
  const history = useHistory();

  // Handle close click.
  const handleCloseClick = () => {
    history.go(-1);
  };

  return (
    <Form>
      {/* ---------- Customer Notes ----------  */}
      <FFormGroup
        name={'customerNotes'}
        label={intl.get('pref.invoices.customerNotes.field')}
        fastField={true}
      >
        <FTextArea
          medium={true}
          name={'customerNotes'}
          fastField={true}
          fill={true}
        />
      </FFormGroup>

      {/* ---------- Terms & Conditions ----------  */}
      <FFormGroup
        name={'termsConditions'}
        label={intl.get('pref.invoices.termsConditions.field')}
        fastField={true}
      >
        <FTextArea
          medium={true}
          name={'termsConditions'}
          fastField={true}
          fill={true}
        />
      </FFormGroup>

      <CardFooterActions>
        <Button loading={isSubmitting} intent={Intent.PRIMARY} type="submit">
          <T id={'save'} />
        </Button>
        <Button onClick={handleCloseClick}>
          <T id={'close'} />
        </Button>
      </CardFooterActions>
    </Form>
  );
}

const CardFooterActions = styled.div`
  --x-color-border: #e0e7ea;

  .bp4-dark & {
    --x-color-border: rgba(255, 255, 255, 0.15);
  }
  padding-top: 16px;
  border-top: 1px solid var(--x-color-border);
  margin-top: 30px;

  .bp4-button {
    min-width: 70px;

    + .bp4-button {
      margin-left: 10px;
    }
  }
`;
