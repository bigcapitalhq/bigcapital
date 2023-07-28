export class GetPaymentBills {
  /**
   * Retrieve payment made associated bills.
   * @param {number} tenantId -
   * @param {number} billPaymentId -
   */
  public async getPaymentBills(tenantId: number, billPaymentId: number) {
    const { Bill } = this.tenancy.models(tenantId);

    const billPayment = await this.getPaymentMadeOrThrowError(
      tenantId,
      billPaymentId
    );
    const paymentBillsIds = billPayment.entries.map((entry) => entry.id);

    const bills = await Bill.query().whereIn('id', paymentBillsIds);

    return bills;
  }
}
