



function ClearningAllLinesAlert() {

    return (

        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'ok'} />}
          intent={Intent.DANGER}
          isOpen={clearLinesAlert}
          onCancel={handleCancelClearLines}
          onConfirm={handleConfirmClearLines}
        >
          <p>
            Clearing the table lines will delete all credits and payments were
            applied. Is this okay?
          </p>
        </Alert>
    )
}