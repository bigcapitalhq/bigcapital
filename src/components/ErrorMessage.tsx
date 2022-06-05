import React from 'react';
import {get} from 'lodash';

const hasErrorMessage = ({
  
}) => {

}

export default function ErrorMessage({
  touched, 
  errors,
  name,
  children,
}) {
  const error = get(errors, name);
  const touch = get(touched, name);
  
  return (error && touch) ? error : null;
}

