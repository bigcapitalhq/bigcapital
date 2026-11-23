import { OverlayToaster, Position, type ToastProps } from '@blueprintjs/core';

const toaster = OverlayToaster.create({ position: Position.TOP });
let nextKey = 0;

// Progress notifications keep a synchronous key to update or dismiss the toast.
export const AppToaster = {
  show(props: ToastProps, key = `app-toast-${nextKey++}`): string {
    void toaster.then((instance) => instance.show(props, key));
    return key;
  },
  dismiss(key: string) {
    void toaster.then((instance) => instance.dismiss(key));
  },
};
