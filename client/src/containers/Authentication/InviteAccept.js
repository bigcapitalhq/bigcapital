import React, { useCallback, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useIntl } from 'react-intl';
import ErrorMessage from 'components/ErrorMessage';
import AppToaster from 'components/AppToaster';
import { compose } from 'utils';
import withAuthenticationActions from './withAuthenticationActions';
import { useParams } from 'react-router-dom';
import {
  Button,
  InputGroup,
  Intent,
  FormGroup,
  Position,
  Spinner,
} from '@blueprintjs/core';
import Icon from 'components/Icon';
import { Row, Col } from 'react-grid-system';
import AuthInsider from 'containers/Authentication/AuthInsider';
import { Link, useHistory } from 'react-router-dom';
import useAsync from 'hooks/async';


function Invite({
  requestInviteAccept,
  requestInviteMetaByToken,
}) {
  const intl = useIntl();
  const { token } = useParams();
  const history = useHistory();
  const [shown, setShown] = useState(false);
  const passwordRevealer = useCallback(() => { setShown(!shown); }, [shown]);

  const ValidationSchema = Yup.object().shape({
    first_name: Yup.string().required(),
    last_name: Yup.string().required(),
    phone_number: Yup.string().matches().required(),
    password: Yup.string()
      .min(4, 'Password has to be longer than 4 characters!')
      .required('Password is required!'),
  });

  const inviteMeta = useAsync(() => {
    return requestInviteMetaByToken(token);
  });

  const inviteErrors = inviteMeta.error || [];
  const inviteValue = {
    organization_name: '',
    invited_email: '',
    ...inviteMeta.value ? 
      inviteMeta.value.data.data : {},
  };

  if (inviteErrors.find(e => e.type === 'INVITE.TOKEN.NOT.FOUND')) {
    AppToaster.show({
      message: 'An unexpected error occurred',
      intent: Intent.DANGER,
      position: Position.BOTTOM,
    });
    history.push('/auth/login');
  }

  const initialValues = useMemo(() => ({
    first_name: '',
    last_name: '',
    phone_number: '',
    password: '',
  }), []);

  const {
    values,
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
              message: 'An unexpected error occurred',
              intent: Intent.DANGER,
              position: Position.BOTTOM,
            });
            history.push('/auth/login');
          }
          if (errors.find(e => e.type === 'PHONE_MUMNER.ALREADY.EXISTS')){
            setErrors({
              phone_number: 'This phone number is used in another account.'
            });
          }
          setSubmitting(false);
        });
    },
  });

  const passwordRevealerTmp = useMemo(() => (
    <span class="password-revealer" onClick={() => passwordRevealer()}>
      {(shown) ? (
        <><Icon icon='eye-slash' /> <span class="text">Hide</span></>
      ) : (
        <><Icon icon='eye' /> <span class="text">Show</span></>
      )} 
    </span>), [shown, passwordRevealer]);

  return (
    <AuthInsider>
      <div className={'invite-form'}>
        <div className={'authentication-page__label-section'}>
          <h3>Welcome to Bigcapital</h3>
          <p>
            Enter your personal information <b>{ inviteValue.organization_name }</b>{' '}
            Organization.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup
                label={'First Name'}
                className={'form-group--first_name'}
                intent={(errors.first_name && touched.first_name) && Intent.DANGER}
                helperText={<ErrorMessage name={'first_name'} {...{errors, touched}} />}
              >
                <InputGroup
                  intent={(errors.first_name && touched.first_name) &&
                    Intent.DANGER
                  }
                  {...getFieldProps('first_name')} />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup
                label={'Last Name'}
                className={'form-group--last_name'}
                intent={(errors.last_name && touched.last_name) &&
                  Intent.DANGER
                }
                helperText={<ErrorMessage name={'last_name'} {...{errors, touched}} />}
              >
                <InputGroup
                  intent={(errors.last_name && touched.last_name) && Intent.DANGER}
                  {...getFieldProps('last_name')}
                />
              </FormGroup>
            </Col>
          </Row>

          <FormGroup
            label={'Phone Number'}
            className={'form-group--phone_number'}
            intent={(errors.phone_number && touched.phone_number) && Intent.DANGER}
            helperText={<ErrorMessage name={'phone_number'} {...{errors, touched}} />}
          >
            <InputGroup
              intent={(errors.phone_number && touched.phone_number) && Intent.DANGER}
              {...getFieldProps('phone_number')}
            />
          </FormGroup>

          <FormGroup
            label={'Password'}
            labelInfo={passwordRevealerTmp}
            className={'form-group--password has-password-revealer'}
            intent={(errors.password && touched.password) && Intent.DANGER}
            helperText={<ErrorMessage name={'password'} {...{errors, touched}} />}
          >
            <InputGroup
              lang={true}
              type={shown ? 'text' : 'password'}
              intent={(errors.password && touched.password) && Intent.DANGER}
              {...getFieldProps('password')}
            />
          </FormGroup>
        
          <div className={'invite-form__statement-section'}>
            <p>
              You email address is <b>{ inviteValue.invited_email },</b> <br />
              You will use this address to sign in to Bigcapital.
            </p>
            <p>
              By signing in or creating an account, you agree with our <br />
              <Link>Terms & Conditions</Link> and <Link> Privacy Statement</Link>
            </p>
          </div>
         
          <div className={'authentication-page__submit-button-wrap'}>
            <Button
              intent={Intent.PRIMARY}
              type='submit'
              fill={true}
              loading={isSubmitting} 
            >
              Create Account
            </Button>
          </div>
        </form>

        { inviteMeta.pending && (
          <div class="authentication-page__loading-overlay">
            <Spinner size={40} />
          </div>
        )}
      </div>
    </AuthInsider>
  );
}

export default compose(
  withAuthenticationActions,
)(Invite);
