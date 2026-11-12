import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateOrganizationDto } from './Organization.dto';

const taxNumberErrors = async (taxNumber: unknown) => {
  const dto = plainToInstance(UpdateOrganizationDto, { taxNumber });
  const errors = await validate(dto);

  return errors.filter((error) => error.property === 'taxNumber');
};

describe('UpdateOrganizationDto.taxNumber', () => {
  it('accepts a two-line tax number', async () => {
    const errors = await taxNumberErrors(
      'TPS/GST 123456789 RT0001\nTVQ/QST 1234567890 TQ0001',
    );

    expect(errors).toHaveLength(0);
  });

  it('accepts 255 characters, the column size', async () => {
    const errors = await taxNumberErrors('x'.repeat(255));

    expect(errors).toHaveLength(0);
  });

  it('rejects 256 characters', async () => {
    const errors = await taxNumberErrors('x'.repeat(256));

    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });
});
