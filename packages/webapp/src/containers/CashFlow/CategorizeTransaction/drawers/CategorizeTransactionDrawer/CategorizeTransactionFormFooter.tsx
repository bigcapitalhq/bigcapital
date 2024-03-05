import { Button, Classes, Intent } from '@blueprintjs/core';

export function CategorizeTransactionFormFooter() {
  return (
    <div>
      <div className={Classes.DRAWER_FOOTER}>
        <Button
          intent={Intent.PRIMARY}
          // loading={isSubmitting}
          style={{ minWidth: '85px' }}
          type="submit"
        >
          Save
        </Button>

        <Button
          // disabled={isSubmitting}
          // onClick={onClose}
          style={{ minWidth: '75px' }}
        >
          Close
        </Button>
      </div>
    </div>
  );
}
