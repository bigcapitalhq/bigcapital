import React from 'react';
import { useParams } from 'react-router-dom';
import { ItemForm } from './ItemForm';

/**
 * Item form page.
 */
export function ItemFormPage() {
  const { id } = useParams<{ id?: string }>();
  const idInteger = id ? parseInt(id, 10) : undefined;

  return <ItemForm itemId={idInteger} />;
}
