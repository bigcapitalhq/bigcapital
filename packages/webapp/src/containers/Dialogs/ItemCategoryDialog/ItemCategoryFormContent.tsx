import { Form } from 'formik';
import React from 'react';
import { ItemCategoryFormFields } from './ItemCategoryFormFields';
import { ItemCategoryFormFooter } from './ItemCategoryFormFooter';

export function ItemCategoryForm(): React.ReactElement {
  return (
    <Form>
      <ItemCategoryFormFields />
      <ItemCategoryFormFooter />
    </Form>
  );
}
