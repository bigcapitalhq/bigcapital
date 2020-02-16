import * as React from "react";
import {useForm} from 'react-hook-form';
import {Link, Redirect} from 'react-router-dom';
import {Button, InputGroup} from "@blueprintjs/core";
import {FormattedMessage} from 'react-intl';

export default function Login() {
  const { register, handleSubmit } = useForm()

  const onSubmit = () => {};

  return (
    <div class="login-page">
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup
          leftIcon="user"
          placeholder={<FormattedMessage id="email_or_phone_number" />}
          large={true}
          ref={register({ required: true })}
          className="input-group--email-phone-number"
          htmlProps={{name: 'email_or_phone_number'}}
        />

        <InputGroup
          leftIcon="info-sign"
          placeholder={<FormattedMessage id="password" />}
          large={true}
          ref={register({ required: true })}
          htmlProps={{name: 'password'}}
          className="input-group--password"
        />

        <Button 
          fill={true}
          large={true}>
          <FormattedMessage id="login" />
        </Button>
      </form>

      <div class="authentication-page__footer">
        <Link to="/reset_password"><FormattedMessage id="reset_password" /></Link>
      </div>
    </div>
  )
}