


function ChangingFullAmountAlert() {

    return (
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'ok'} />}
          intent={Intent.WARNING}
          isOpen={amountChangeAlert}
          onCancel={handleCancelAmountChangeAlert}
          onConfirm={handleConfirmAmountChangeAlert}
        >
          <p>
            <T
              id={'changing_full_amount_will_change_all_credits_and_payment'}
            />
          </p>
        </Alert>
    )
}