import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NumberFormatQueryDto } from './NumberFormatQuery.dto';

describe('NumberFormatQueryDto', () => {
  it.each([
    ['true', true],
    ['1', true],
    ['false', false],
    ['0', false],
    [true, true],
  ])('parses showInRed %p as %p', async (input, expected) => {
    const dto = plainToInstance(NumberFormatQueryDto, { showInRed: input });

    expect(dto.showInRed).toBe(expected);
    expect(await validate(dto)).toEqual([]);
  });

  it('leaves showInRed undefined when it is not given', async () => {
    const dto = plainToInstance(NumberFormatQueryDto, { precision: '2' });

    expect(dto.showInRed).toBeUndefined();
    expect(await validate(dto)).toEqual([]);
  });
});
