import { ERRORS } from '../VendorCreditsApplyBills.constants';
import { ApplyVendorCreditToBillsService } from './ApplyVendorCreditToBills.service';

const buildQuery = (result: unknown) => {
  const resultPromise = Promise.resolve(result);
  const chain: any = {
    findById: jest.fn(() => chain),
    forUpdate: jest.fn(() => chain),
    throwIfNotFound: jest.fn(() => chain),
    then: resultPromise.then.bind(resultPromise),
    catch: resultPromise.catch.bind(resultPromise),
  };
  return chain;
};

const createService = ({
  bills,
  creditsRemaining = 1000,
}: {
  bills: Array<Record<string, unknown>>;
  creditsRemaining?: number;
}) => {
  const vendorCredit = { id: 1, vendorId: 1, creditsRemaining };
  const vendorCreditModel = jest.fn(() => ({
    query: jest.fn(() => buildQuery(vendorCredit)),
  }));
  const billPaymentValidators = {
    validateBillsExistance: jest.fn(() => Promise.resolve(bills)),
  };
  const vendorCreditDTOTransform = {
    validateCreditRemainingAmount: jest.fn(),
  };
  const service = new ApplyVendorCreditToBillsService(
    {} as any,
    {} as any,
    billPaymentValidators as any,
    vendorCreditDTOTransform as any,
    jest.fn() as any,
    vendorCreditModel as any,
  );
  return { service, vendorCreditDTOTransform };
};

describe('ApplyVendorCreditToBillsService', () => {
  describe('validate', () => {
    it('accepts applying credit to several bills within each bill due amount', async () => {
      const { service, vendorCreditDTOTransform } = createService({
        bills: [
          { id: 1, dueAmount: 100 },
          { id: 2, dueAmount: 100 },
        ],
      });

      const { vendorCreditAppliedModel } = await service.validate(
        1,
        {
          entries: [
            { billId: 1, amount: 100 },
            { billId: 2, amount: 100 },
          ],
        },
        {} as any,
      );
      expect(vendorCreditAppliedModel.amount).toBe(200);
      expect(
        vendorCreditDTOTransform.validateCreditRemainingAmount,
      ).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }), 200);
    });

    it('rejects applying more credit to a bill than its due amount', async () => {
      const { service } = createService({
        bills: [
          { id: 1, dueAmount: 100 },
          { id: 2, dueAmount: 100 },
        ],
      });

      await expect(
        service.validate(
          1,
          {
            entries: [
              { billId: 1, amount: 50 },
              { billId: 2, amount: 101 },
            ],
          },
          {} as any,
        ),
      ).rejects.toMatchObject({
        errorType: ERRORS.BILLS_HAS_NO_REMAINING_AMOUNT,
      });
    });

    it('sums the entries of the same bill against its due amount', async () => {
      const { service } = createService({
        bills: [{ id: 1, dueAmount: 100 }],
      });

      await expect(
        service.validate(
          1,
          {
            entries: [
              { billId: 1, amount: 60 },
              { billId: 1, amount: 60 },
            ],
          },
          {} as any,
        ),
      ).rejects.toMatchObject({
        errorType: ERRORS.BILLS_HAS_NO_REMAINING_AMOUNT,
      });
    });
  });
});
