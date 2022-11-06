// @ts-nocheck
import React from 'react';
import { Form } from 'formik';
import ItemCategoryFormFields from './ItemCategoryFormFields';
import ItemCategoryFormFooter from './ItemCategoryFormFooter';

export default function ItemCategoryForm() {
  return (
    <Form>
      <ItemCategoryFormFields />
      <ItemCategoryFormFooter />
    </Form>
  );
}
