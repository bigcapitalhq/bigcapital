import Axios from 'axios';
import { FXMacroDataExchangeRate } from './FXMacroDataExchangeRate';
import { ExchangeRate } from './ExchangeRate';
import { EchangeRateErrors, ExchangeRateServiceType } from './types';

jest.mock('axios');

const mockedGet = Axios.get as jest.Mock;

const httpError = (status: number, data: any = {}) =>
  Object.assign(new Error(`Request failed with status code ${status}`), {
    response: { status, data },
  });

describe('FXMacroDataExchangeRate', () => {
  afterEach(() => {
    mockedGet.mockReset();
  });

  it('returns the newest rate that has a value', async () => {
    mockedGet.mockResolvedValue({
      data: {
        data: [
          { date: '2026-09-30', val: null },
          { date: '2026-09-29', val: 0.8512 },
          { date: '2026-09-28', val: 0.8498 },
        ],
      },
    });
    const service = new FXMacroDataExchangeRate('test-key');

    await expect(service.latest('USD', 'EUR')).resolves.toBe(0.8512);
    expect(mockedGet).toHaveBeenCalledWith(
      'https://api.fxmacrodata.com/v1/forex/USD/EUR',
      {
        headers: { 'X-API-Key': 'test-key' },
        params: { limit: 5 },
        maxRedirects: 0,
      },
    );
  });

  it('returns 1 for the same currency without a request', async () => {
    const service = new FXMacroDataExchangeRate('test-key');

    await expect(service.latest('USD', 'USD')).resolves.toBe(1);
    expect(mockedGet).not.toHaveBeenCalled();
  });

  it('requires an api key', async () => {
    const service = new FXMacroDataExchangeRate('');

    await expect(service.latest('USD', 'EUR')).rejects.toMatchObject({
      errorType: EchangeRateErrors.EX_RATE_SERVICE_API_KEY_REQUIRED,
    });
    expect(mockedGet).not.toHaveBeenCalled();
  });

  it('throws when no row has a value', async () => {
    mockedGet.mockResolvedValue({
      data: { data: [{ date: '2026-09-30', val: null }] },
    });
    const service = new FXMacroDataExchangeRate('test-key');

    await expect(service.latest('USD', 'EUR')).rejects.toMatchObject({
      errorType: EchangeRateErrors.EX_RATE_SERVICE_NOT_ALLOWED,
    });
  });

  it('throws a service error for a 200 error body or wrong shape', async () => {
    const service = new FXMacroDataExchangeRate('test-key');
    for (const data of [
      { detail: 'Invalid API key' },
      { data: { val: 1 } },
      [],
      'not json',
    ]) {
      mockedGet.mockResolvedValueOnce({ data });
      await expect(service.latest('USD', 'EUR')).rejects.toMatchObject({
        errorType: EchangeRateErrors.EX_RATE_SERVICE_NOT_ALLOWED,
      });
    }
  });

  it('maps an invalid api key', async () => {
    mockedGet.mockRejectedValue(httpError(401, { code: 'invalid_api_key' }));
    const service = new FXMacroDataExchangeRate('test-key');

    await expect(service.latest('USD', 'EUR')).rejects.toMatchObject({
      errorType: EchangeRateErrors.EX_RATE_SERVICE_API_KEY_REQUIRED,
    });
  });

  it('maps the rate limit', async () => {
    mockedGet.mockRejectedValue(httpError(429));
    const service = new FXMacroDataExchangeRate('test-key');

    await expect(service.latest('USD', 'EUR')).rejects.toMatchObject({
      errorType: EchangeRateErrors.EX_RATE_LIMIT_EXCEEDED,
    });
  });

  it('maps an unsupported base currency', async () => {
    mockedGet.mockRejectedValue(
      httpError(422, { detail: [{ loc: ['path', 'base'] }] }),
    );
    const service = new FXMacroDataExchangeRate('test-key');

    await expect(service.latest('XYZ', 'EUR')).rejects.toMatchObject({
      errorType: EchangeRateErrors.EX_RATE_INVALID_BASE_CURRENCY,
    });
  });

  it('maps an unsupported quote currency', async () => {
    mockedGet.mockRejectedValue(
      httpError(422, { detail: [{ loc: ['path', 'quote'] }] }),
    );
    const service = new FXMacroDataExchangeRate('test-key');

    await expect(service.latest('USD', 'XYZ')).rejects.toMatchObject({
      errorType: EchangeRateErrors.EX_RATE_SERVICE_NOT_ALLOWED,
    });
  });

  it('rethrows other errors', async () => {
    const error = httpError(500);
    mockedGet.mockRejectedValue(error);
    const service = new FXMacroDataExchangeRate('test-key');

    await expect(service.latest('USD', 'EUR')).rejects.toBe(error);
  });
});

describe('ExchangeRate', () => {
  const original = process.env.FXMACRODATA_API_KEY;

  afterEach(() => {
    mockedGet.mockReset();
    if (original === undefined) delete process.env.FXMACRODATA_API_KEY;
    else process.env.FXMACRODATA_API_KEY = original;
  });

  it('uses FXMacroData with the key from FXMACRODATA_API_KEY', async () => {
    process.env.FXMACRODATA_API_KEY = 'env-key';
    mockedGet.mockResolvedValue({
      data: { data: [{ date: '2026-09-30', val: 1.3421 }] },
    });
    const exchange = new ExchangeRate(ExchangeRateServiceType.FXMacroData);

    await expect(exchange.latest('GBP', 'USD')).resolves.toBe(1.3421);
    expect(mockedGet).toHaveBeenCalledWith(
      'https://api.fxmacrodata.com/v1/forex/GBP/USD',
      expect.objectContaining({ headers: { 'X-API-Key': 'env-key' } }),
    );
  });
});
