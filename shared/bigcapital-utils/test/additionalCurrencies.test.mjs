import { test } from 'node:test';
import assert from 'node:assert/strict';
import { additionalCurrencies } from '../dist/index.mjs';

test('includes the Netherlands Antillean guilder and the Caribbean guilder', () => {
  assert.equal(additionalCurrencies.ANG.name, 'Netherlands Antillean Guilder');
  assert.equal(additionalCurrencies.XCG.name, 'Caribbean Guilder');
});

test('every entry is keyed by its own ISO 4217 code and fully described', () => {
  for (const [key, currency] of Object.entries(additionalCurrencies)) {
    assert.match(key, /^[A-Z]{3}$/);
    assert.equal(currency.code, key);
    assert.ok(currency.name, `${key} name`);
    assert.ok(currency.symbol, `${key} symbol`);
    assert.ok(currency.symbol_native, `${key} symbol_native`);
    assert.ok(currency.name_plural, `${key} name_plural`);
    assert.ok([0, 2, 3].includes(currency.decimal_digits), `${key} digits`);
  }
});
