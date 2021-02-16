



function ClearTransactionAlert() {

    return (
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'ok'} />}
          intent={Intent.WARNING}
          isOpen={clearFormAlert}
          onCancel={handleCancelClearFormAlert}
          onConfirm={handleConfirmCancelClearFormAlert}
        >
          <p>
            <T id={'are_you_sure_you_want_to_clear_this_transaction'} />
          </p>
        </Alert>
    )
}