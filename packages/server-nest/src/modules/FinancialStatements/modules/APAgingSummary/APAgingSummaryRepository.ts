


export class APAgingSummaryRepository {


  asyncInit() {
    // Settings tenant service.
    const tenant = await Tenant.query()
      .findById(tenantId)
      .withGraphFetched('metadata');

    // Retrieve all vendors from the storage.
    const vendors =
      filter.vendorsIds.length > 0
        ? await vendorRepository.findWhereIn('id', filter.vendorsIds)
        : await vendorRepository.all();

    // Common query.
    const commonQuery = (query) => {
      if (!isEmpty(filter.branchesIds)) {
        query.modify('filterByBranches', filter.branchesIds);
      }
    };
    // Retrieve all overdue vendors bills.
    const overdueBills = await Bill.query()
      .modify('overdueBillsFromDate', filter.asDate)
      .onBuild(commonQuery);

    // Retrieve all due vendors bills.
    const dueBills = await Bill.query()
      .modify('dueBillsFromDate', filter.asDate)
      .onBuild(commonQuery);
  }
}