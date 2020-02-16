import * as React from "react";
import { Link } from 'react-router-dom';
import {Button, InputGroup} from "@blueprintjs/core";
import { FormattedMessage } from 'react-intl';

export default function Login() {
  return (
    <div class="login-page">
      <form>
        <InputGroup
          leftIcon="user"
          placeholder={<FormattedMessage id="email_or_phone_number" />}
          large={true}
          className="input-group--email"
        />

        <Button
          fill={true}
          large={true}>
          <FormattedMessage id="reset_password" />
        </Button>
      </form>

      <div class="authentication-page__footer">
        <Link to="/login"><FormattedMessage id="login" /></Link>
      </div>
    </div>
  )
}