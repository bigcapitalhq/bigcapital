import { Formik, FormikHelpers } from 'formik';
import { useAuthMetaBoot } from '../AuthMetaBoot';
import { GoogleAuthSection } from '../GoogleAuthButton';
import { LoginForm } from '../LoginForm';
import { LoginSchema, LoginValues } from '../utils';

const initialValues: LoginValues = {
  crediential: '',
  password: '',
  keepLoggedIn: false,
};

interface LoginCredentialsStepProps {
  onSubmit: (values: LoginValues, helpers: FormikHelpers<LoginValues>) => void;
}

/**
 * The first step: Google, email and password.
 */
export function LoginCredentialsStep({ onSubmit }: LoginCredentialsStepProps) {
  const { googleEnabled } = useAuthMetaBoot();

  return (
    <>
      {googleEnabled && <GoogleAuthSection />}
      <Formik
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={onSubmit}
        component={LoginForm}
      />
    </>
  );
}
