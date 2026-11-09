import { get } from 'lodash';
import type { ReactNode } from 'react';

interface ErrorMessageProps {
  touched?: unknown;
  errors?: unknown;
  name: string;
  children?: ReactNode;
}

export function ErrorMessage({ touched, errors, name }: ErrorMessageProps) {
  const error = get(errors, name);
  const touch = get(touched, name);

  return error && touch ? error : null;
}
