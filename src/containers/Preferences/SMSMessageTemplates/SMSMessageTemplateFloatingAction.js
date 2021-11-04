import React from 'react';
import { useFormikContext } from 'formik';

import { Intent, Button, Classes } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';
import { useHistory } from 'react-router-dom';

function SMSMessageTemplateFloatingAction() {
  const history = useHistory();
  const { isSubmitting } = useFormikContext();

  const handleCloseClick = () => {
    history.go(-1);
  };

  return (
    <div className={'card__footer'}>
      <Button intent={Intent.PRIMARY} loading={isSubmitting} type="submit">
        <T id={'save'} />
      </Button>
      <Button onClick={handleCloseClick} disabled={isSubmitting}>
        <T id={'close'} />
      </Button>
    </div>
  );
}

export default SMSMessageTemplateFloatingAction;
