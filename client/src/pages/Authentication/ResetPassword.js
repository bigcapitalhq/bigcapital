import * as React from "react";
import {
  Button,
  InputGroup,
} from "@blueprintjs/core";

export default function Login() {
  return (
    <div class="login-page">
      <InputGroup
        leftIcon="filter"
        placeholder="Email or phone number"
      />

      <Button>
        {"Reset password"}
      </Button>
    </div>
  )
}