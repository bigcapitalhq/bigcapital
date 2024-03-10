// @ts-nocheck
import styled from 'styled-components';
import { Form } from 'formik';
import { Button, Intent } from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';

import { FormattedMessage as T, FFormGroup, FTextArea } from '@/components';

/**
 * Preferences credit notes form.
 */
export function PreferencesCreditNotesForm({ isSubmitting }) {
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
        label={<T id={'pref.creditNotes.customerNotes.field'} />}
        fastField={true}
      >
        <FTextArea
          medium={'true'}
          name={'customerNotes'}
          fastField={true}
          fill={true}
        />
      </FFormGroup>

      {/* ---------- Terms & Conditions ----------  */}
      <FFormGroup
        name={'termsConditions'}
        label={<T id={'pref.creditNotes.termsConditions.field'} />}
        fastField={true}
      >
        <FTextArea
          medium={'true'}
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
  padding-top: 16px;
  border-top: 1px solid #e0e7ea;
  margin-top: 30px;

  .bp4-button {
    min-width: 70px;

    + .bp4-button {
      margin-left: 10px;
    }
  }
`;
