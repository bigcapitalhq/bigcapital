import React, { useCallback, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Button,
  InputGroup,
  Intent,
  FormGroup,
  Position,
  Spinner,
} from '@blueprintjs/core';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'react-grid-system';
import { Link, useHistory } from 'react-router-dom';
import { FormattedMessage as T, useIntl } from 'react-intl';


import AppToaster from 'components/AppToaster';
import ErrorMessage from 'components/ErrorMessage';

import Icon from 'components/Icon';
import { If } from 'components';
import useAsync from 'hooks/async';
import AuthInsider from 'containers/Authentication/AuthInsider';

import withAuthenticationActions from './withAuthenticationActions';

import { compose } from 'utils';

function Invite({ requestInviteAccept, requestInviteMetaByToken }) {
  const { formatMessage } = useIntl();
  const { token } = useParams();
  const history = useHistory();
  const [shown, setShown] = useState(false);
  const passwordRevealer = useCallback(() => {
    setShown(!shown);
  }, [shown]);

  const ValidationSchema = Yup.object().shape({
    first_name: Yup.string().required().label(formatMessage({id:'first_name_'})),
    last_name: Yup.string().required().label(formatMessage({id:'last_name_'})),
    phone_number: Yup.string()
      .matches()
      .required()
      .label(formatMessage({id:'phone_number'})),
    password: Yup.string()
      .min(4)
      .required().label(formatMessage({id:'password'}))
  });

  const inviteMeta = useAsync(() => {
    return requestInviteMetaByToken(token);
  });

  const inviteErrors = inviteMeta.error || [];
  const inviteValue = {
    organization_name: '',
    invited_email: '',
    ...(inviteMeta.value ? inviteMeta.value.data.data : {}),
  };

  if (inviteErrors.find((e) => e.type === 'INVITE.TOKEN.NOT.FOUND')) {
    AppToaster.show({
      message: 'An unexpected error occurred',
      intent: Intent.DANGER,
      position: Position.BOTTOM,
    });
    history.push('/auth/login');
  }

  const initialValues = useMemo(
    () => ({
      first_name: '',
      last_name: '',
      phone_number: '',
      password: '',
    }),
    []
  );

  const {
    touched,
    errors,
    handleSubmit,
    getFieldProps,
    isSubmitting,
  } = useFormik({
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: (values, { setSubmitting, setErrors }) => {
      requestInviteAccept(values, token)
        .then((response) => {
          AppToaster.show({
            message: `Congrats! Your account has been created and invited to
              <strong>${inviteValue.organization_name}</strong> organization successfully.`,
            intent: Intent.SUCCESS,
          });
          setSubmitting(false);
        })
        .catch((errors) => {
          if (errors.find((e) => e.type === 'INVITE.TOKEN.NOT.FOUND')) {
            AppToaster.show({
              message: formatMessage({ id: 'an_unexpected_error_occurred' }),
              intent: Intent.DANGER,
              position: Position.BOTTOM,
            });
            history.push('/auth/login');
          }
          if (errors.find((e) => e.type === 'PHONE_MUMNER.ALREADY.EXISTS')) {
            setErrors({
              phone_number: 'This phone number is used in another account.',
            });
          }
          setSubmitting(false);
        });
    },
  });

  const passwordRevealerTmp = useMemo(
    () => (
      <span class='password-revealer' onClick={() => passwordRevealer()}>
        <If condition={shown}>
          <>
            <Icon icon='eye-slash' />{' '}
            <span class='text'>
              <T id={'hide'} />
            </span>
          </>
        </If>
        <If condition={!shown}>
          <>
            <Icon icon='eye' />{' '}
            <span class='text'>
              <T id={'show'} />
            </span>
          </>
        </If>
      </span>
    ),
    [shown, passwordRevealer]
  );

  return (
    <AuthInsider>
      <div className={'invite-form'}>
        <div className={'authentication-page__label-section'}>
          <h3>
            <T id={'welcome_to_bigcapital'} />
          </h3>
          <p>
            <T id={'enter_your_personal_information'} />
            <b>{inviteValue.organization_name}</b> <T id={'organization'}/>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup
                label={<T id={'First Name'} />}
                className={'form-group--first_name'}
                intent={
                  errors.first_name && touched.first_name && Intent.DANGER
                }
                helperText={
                  <ErrorMessage name={'first_name'} {...{ errors, touched }} />
                }
              >
                <InputGroup
                  intent={
                    errors.first_name && touched.first_name && Intent.DANGER
                  }
                  {...getFieldProps('first_name')}
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup
                label={<T id={'Last Name'} />}
                className={'form-group--last_name'}
                intent={errors.last_name && touched.last_name && Intent.DANGER}
                helperText={
                  <ErrorMessage name={'last_name'} {...{ errors, touched }} />
                }
              >
                <InputGroup
                  intent={
                    errors.last_name && touched.last_name && Intent.DANGER
                  }
                  {...getFieldProps('last_name')}
                />
              </FormGroup>
            </Col>
          </Row>

          <FormGroup
            label={<T id={'Phone Number'} />}
            className={'form-group--phone_number'}
            intent={
              errors.phone_number && touched.phone_number && Intent.DANGER
            }
            helperText={
              <ErrorMessage name={'phone_number'} {...{ errors, touched }} />
            }
          >
            <InputGroup
              intent={
                errors.phone_number && touched.phone_number && Intent.DANGER
              }
              {...getFieldProps('phone_number')}
            />
          </FormGroup>

          <FormGroup
            label={<T id={'password'} />}
            labelInfo={passwordRevealerTmp}
            className={'form-group--password has-password-revealer'}
            intent={errors.password && touched.password && Intent.DANGER}
            helperText={
              <ErrorMessage name={'password'} {...{ errors, touched }} />
            }
          >
            <InputGroup
              lang={true}
              type={shown ? 'text' : 'password'}
              intent={errors.password && touched.password && Intent.DANGER}
              {...getFieldProps('password')}
            />
          </FormGroup>

          <div className={'invite-form__statement-section'}>
            <p>
              <T id={'You email address is'} />{' '}
              <b>{inviteValue.invited_email},</b> <br />
              <T id={'you_will_use_this_address_to_sign_in_to_bigcapital'} />
            </p>
            <p>
              <T id={'signing_in_or_creating'} /> <br />
              <Link>
                <T id={'terms_conditions'} />
              </Link>{' '}
              <T id={'and'} />
              <Link>
                {' '}
                <T id={'privacy_statement'} />
              </Link>
            </p>
          </div>

          <div className={'authentication-page__submit-button-wrap'}>
            <Button
              intent={Intent.PRIMARY}
              type='submit'
              fill={true}
              loading={isSubmitting}
            >
              <T id={'create_account'} />
            </Button>
          </div>
        </form>

        {inviteMeta.pending && (
          <div class='authentication-page__loading-overlay'>
            <Spinner size={40} />
          </div>
        )}
      </div>
    </AuthInsider>
  );
}

export default compose(withAuthenticationActions)(Invite);
