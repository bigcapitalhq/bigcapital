import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateOrganizationDto } from './Organization.dto';
import { DATE_FORMATS as ORGANIZATION_DATE_FORMATS } from '../Organization.constants';
import { DATE_FORMATS as OFFERED_DATE_FORMATS } from '../../Miscellaneous/Miscellaneous.constants';
import { GetDateFormatsService } from '../../Miscellaneous/queries/GetDateFormats.service';

describe('UpdateOrganizationDto dateFormat', () => {
  it('accepts the short US format MMM DD, YYYY', async () => {
    const dto = plainToInstance(UpdateOrganizationDto, {
      dateFormat: 'MMM DD, YYYY',
    });

    expect(await validate(dto)).toEqual([]);
  });

  it('rejects a format that is not offered', async () => {
    const dto = plainToInstance(UpdateOrganizationDto, {
      dateFormat: 'MMM D YY',
    });
    const errors = await validate(dto);

    expect(errors.map((error) => error.property)).toEqual(['dateFormat']);
  });

  // the dropdown lists one copy and validation checks the other, so a format
  // added to only one of them is either hidden or rejected on save.
  it('validates exactly the formats the Date Format dropdown offers', () => {
    expect(ORGANIZATION_DATE_FORMATS).toEqual(OFFERED_DATE_FORMATS);
  });
});

describe('GetDateFormatsService', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 10, 16));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('labels MMM DD, YYYY with a sample date, after MMMM DD, YYYY', () => {
    const formats = new GetDateFormatsService().getDateFormats();
    const keys = formats.map((format) => format.key);

    expect(formats).toContainEqual({
      key: 'MMM DD, YYYY',
      label: 'Nov 16, 2026 [MMM DD, YYYY]',
    });
    expect(keys.indexOf('MMM DD, YYYY')).toBe(
      keys.indexOf('MMMM DD, YYYY') + 1,
    );
  });
});
