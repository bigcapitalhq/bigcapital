import { addCamelCaseAliases } from './SnakeCaseBody';

describe('addCamelCaseAliases', () => {
  it('adds a camelCase alias next to every snake_case key, keeping the original', () => {
    expect(
      addCamelCaseAliases({ primary_color: '#c2b942', logo_key: '' }),
    ).toEqual({
      primary_color: '#c2b942',
      primaryColor: '#c2b942',
      logo_key: '',
      logoKey: '',
    });
  });

  it('recurses into nested objects and arrays', () => {
    expect(
      addCamelCaseAliases({
        address: { state_province: 'AK', postal_code: '99603' },
        tags: [{ tag_name: 'a' }],
      }),
    ).toEqual({
      address: {
        state_province: 'AK',
        stateProvince: 'AK',
        postal_code: '99603',
        postalCode: '99603',
      },
      tags: [{ tag_name: 'a', tagName: 'a' }],
    });
  });

  it('leaves already-camelCase and single-word keys untouched', () => {
    expect(addCamelCaseAliases({ primaryColor: '#fff', name: 'Acme' })).toEqual(
      {
        primaryColor: '#fff',
        name: 'Acme',
      },
    );
  });

  it('does not overwrite an explicit camelCase sibling', () => {
    expect(
      addCamelCaseAliases({ logo_key: 'snake', logoKey: 'camel' }),
    ).toEqual({ logo_key: 'snake', logoKey: 'camel' });
  });

  it('ignores leading-underscore keys and passes through primitives / null', () => {
    expect(addCamelCaseAliases({ _internal_flag: 1 })).toEqual({
      _internal_flag: 1,
    });
    expect(addCamelCaseAliases(null)).toBeNull();
    expect(addCamelCaseAliases('x')).toBe('x');
  });
});
