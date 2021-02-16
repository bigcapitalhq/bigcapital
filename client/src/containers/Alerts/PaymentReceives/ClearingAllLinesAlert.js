


function ClearingAllLinesAlert() {

    return (
        <Alert
          cancelButtonText={<T id={'cancel'} />}
          confirmButtonText={<T id={'ok'} />}
          intent={Intent.WARNING}
          isOpen={clearLinesAlert}
          onCancel={handleCancelClearLines}
          onConfirm={handleConfirmClearLines}
        >
          <p>
            <T id={'clearing_the_table_lines_will_delete_all_credits'} />
          </p>
        </Alert>
    )
}