// @ts-nocheck



function JournalBulkDeleteAlert({}) {
    // Handle confirm journals bulk delete.
    const handleConfirmBulkDelete = useCallback(() => {
      requestDeleteBulkManualJournals(bulkDelete)
        .then(() => {
          setBulkDelete(false);
          AppToaster.show({
            message: formatMessage(
              { id: 'the_journals_has_been_deleted_successfully' },
              { count: selectedRowsCount },
            ),
            intent: Intent.SUCCESS,
          });
        })
        .catch((error) => {
          setBulkDelete(false);
        });
    }, [
      requestDeleteBulkManualJournals,
      bulkDelete,
      formatMessage,
      selectedRowsCount,
    ]);

    
  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={
        <T id={'delete_count'} values={{ count: selectedRowsCount }} />
      }
      icon="trash"
      intent={Intent.DANGER}
      isOpen={bulkDelete}
      onCancel={handleCancelBulkDelete}
      onConfirm={handleConfirmBulkDelete}
    >
      <p>
        <T id={'once_delete_these_journals_you_will_not_able_restore_them'} />
      </p>
    </Alert>
  );
}
