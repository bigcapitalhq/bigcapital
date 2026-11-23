// @ts-nocheck
import React from 'react';
import { NS } from '@/constants/classes';

export function MenuItemLabel({ text }) {
  return <span class={`${NS}-menu-item-labeler`}>{text}</span>;
}
