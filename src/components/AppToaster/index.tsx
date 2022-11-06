// @ts-nocheck
import { Position, Toaster, Intent } from '@blueprintjs/core';

export const AppToaster = Toaster.create({
  position: Position.RIGHT_BOTTOM,
  intent: Intent.WARNING,
});
