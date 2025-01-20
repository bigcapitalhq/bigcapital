





export class ARAgingSummaryRepository {


  init(){
    const tenant = await Tenant.query()
    .findById(tenantId)
    .withGraphFetched('metadata');

  // Retrieve all customers from the storage.
  const customers =
    filter.customersIds.length > 0
      ? await customerRepository.findWhereIn('id', filter.customersIds)
      : await customerRepository.all();

  // Common query.
  const commonQuery = (query) => {
    if (!isEmpty(filter.branchesIds)) {
      query.modify('filterByBranches', filter.branchesIds);
    }
  };
  // Retrieve all overdue sale invoices.
  const overdueSaleInvoices = await SaleInvoice.query()
    .modify('overdueInvoicesFromDate', filter.asDate)
    .onBuild(commonQuery);

  // Retrieve all due sale invoices.
  const currentInvoices = await SaleInvoice.query()
    .modify('dueInvoicesFromDate', filter.asDate)
    .onBuild(commonQuery);

  }
}