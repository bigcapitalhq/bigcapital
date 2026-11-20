import { CommandCreditNoteDTOTransform } from './CommandCreditNoteDTOTransform.service';
import { CreditNote } from '../models/CreditNote';
import { CreateCreditNoteDto } from '../dtos/CreditNote.dto';

describe('CommandCreditNoteDTOTransform', () => {
  const createService = (nextNumber = 'CN-00007') => {
    // `async/compose` only treats native async functions as promise-returning;
    // a plain function would be called callback-style and never resolve.
    const identity = async <T>(value: T) => value;
    const itemsEntriesService = {
      getTotalItemsEntries: jest.fn().mockReturnValue(100),
    } as any;
    const branchDTOTransform = { transformDTO: identity } as any;
    const warehouseDTOTransform = { transformDTO: identity } as any;
    const brandingTemplatesTransformer = {
      assocDefaultBrandingTemplate: () => identity,
    } as any;
    const creditNoteAutoIncrement = {
      getNextCreditNumber: jest.fn().mockResolvedValue(nextNumber),
    } as any;

    return new CommandCreditNoteDTOTransform(
      itemsEntriesService,
      branchDTOTransform,
      warehouseDTOTransform,
      brandingTemplatesTransformer,
      creditNoteAutoIncrement,
    );
  };

  const creditNoteDTO = (
    overrides: Partial<CreateCreditNoteDto> = {},
  ): CreateCreditNoteDto =>
    ({
      customerId: 1,
      creditNoteDate: '2026-11-03',
      entries: [{ index: 1, itemId: 1, quantity: 1, rate: 100 }],
      ...overrides,
    }) as CreateCreditNoteDto;

  it('numbers a credit note created without a number from the auto-increment sequence', async () => {
    const service = createService('CN-00007');

    const model = await service.transformCreateEditDTOToModel(
      creditNoteDTO(),
      'CAD',
    );

    expect(model.creditNoteNumber).toBe('CN-00007');
  });

  it('keeps the number given in the DTO', async () => {
    const service = createService('CN-00007');

    const model = await service.transformCreateEditDTOToModel(
      creditNoteDTO({ creditNoteNumber: 'CN-MANUAL' }),
      'CAD',
    );

    expect(model.creditNoteNumber).toBe('CN-MANUAL');
  });

  it('keeps the existing number when editing without a number', async () => {
    const service = createService('CN-00007');
    const oldCreditNote = { creditNoteNumber: 'CN-00003' } as CreditNote;

    const model = await service.transformCreateEditDTOToModel(
      creditNoteDTO(),
      'CAD',
      oldCreditNote,
    );

    expect(model.creditNoteNumber).toBe('CN-00003');
  });
});
