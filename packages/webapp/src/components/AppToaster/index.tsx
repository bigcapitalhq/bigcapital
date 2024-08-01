// @ts-nocheck
import { Position, Toaster, Intent } from '@blueprintjs/core';

export const AppToaster = Toaster.create({
  position: Position.TOP,
  intent: Intent.WARNING,
});
