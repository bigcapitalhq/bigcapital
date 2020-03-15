import { Position, Toaster, Intent } from "@blueprintjs/core";

const AppToaster = Toaster.create({
  position: Position.TOP,
  intent: Intent.WARNING,
});

export default AppToaster;