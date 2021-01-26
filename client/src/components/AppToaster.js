import { Position, Toaster, Intent } from "@blueprintjs/core";

const AppToaster = Toaster.create({
  position: Position.RIGHT_BOTTOM,
  intent: Intent.WARNING,
});

export default AppToaster;