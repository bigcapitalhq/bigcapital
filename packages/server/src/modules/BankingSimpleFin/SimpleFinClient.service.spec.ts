import axios from 'axios';
import { SimpleFinClient } from './SimpleFinClient.service';
import { ERRORS } from './constants';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const ACCESS_URL = 'https://user:secret@beta-bridge.simplefin.org/simplefin';

describe('SimpleFinClient', () => {
  let client: SimpleFinClient;

  beforeEach(() => {
    jest.resetAllMocks();
    client = new SimpleFinClient();
  });

  describe('claimAccessUrl', () => {
    it('POSTs to the claim URL and returns the access URL', async () => {
      mockedAxios.post.mockResolvedValue({ data: `${ACCESS_URL}\n` });

      await expect(
        client.claimAccessUrl('https://bridge.example/claim/TOKEN'),
      ).resolves.toBe(ACCESS_URL);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://bridge.example/claim/TOKEN',
        undefined,
        expect.objectContaining({ responseType: 'text' }),
      );
    });

    it('maps a 403 to a rejected token error', async () => {
      mockedAxios.post.mockRejectedValue({ response: { status: 403 } });

      await expect(
        client.claimAccessUrl('https://bridge.example/claim/TOKEN'),
      ).rejects.toMatchObject({
        errorType: ERRORS.SIMPLEFIN_SETUP_TOKEN_REJECTED,
      });
    });

    it('rejects access URLs without credentials', async () => {
      mockedAxios.post.mockResolvedValue({
        data: 'https://beta-bridge.simplefin.org/simplefin',
      });
      await expect(
        client.claimAccessUrl('https://bridge.example/claim/TOKEN'),
      ).rejects.toMatchObject({ errorType: ERRORS.SIMPLEFIN_REQUEST_FAILED });
    });
  });

  describe('getAccounts', () => {
    it('requests /accounts with basic auth and the query parameters', async () => {
      mockedAxios.get.mockResolvedValue({
        data: { errors: [], accounts: [{ id: 'ACT-1' }] },
      });
      const startDate = new Date('2025-10-01T00:00:00Z');

      const result = await client.getAccounts(ACCESS_URL, {
        startDate,
        accountIds: ['ACT-1', 'ACT-2'],
        balancesOnly: true,
      });

      expect(result.accounts).toHaveLength(1);
      const [url, options] = mockedAxios.get.mock.calls[0];
      const parsed = new URL(url as string);

      expect(parsed.origin + parsed.pathname).toBe(
        'https://beta-bridge.simplefin.org/simplefin/accounts',
      );
      expect(parsed.searchParams.get('start-date')).toBe(
        String(Math.floor(startDate.getTime() / 1000)),
      );
      expect(parsed.searchParams.getAll('account')).toEqual(['ACT-1', 'ACT-2']);
      expect(parsed.searchParams.get('balances-only')).toBe('1');
      expect(parsed.searchParams.has('pending')).toBe(false);
      expect(options).toMatchObject({
        auth: { username: 'user', password: 'secret' },
      });
    });

    it('normalizes a response without errors/accounts arrays', async () => {
      mockedAxios.get.mockResolvedValue({ data: {} });

      await expect(client.getAccounts(ACCESS_URL)).resolves.toEqual({
        errors: [],
        accounts: [],
      });
    });

    it('maps 403 and 402 to dedicated errors', async () => {
      mockedAxios.get.mockRejectedValueOnce({ response: { status: 403 } });
      await expect(client.getAccounts(ACCESS_URL)).rejects.toMatchObject({
        errorType: ERRORS.SIMPLEFIN_ACCESS_FORBIDDEN,
      });

      mockedAxios.get.mockRejectedValueOnce({ response: { status: 402 } });
      await expect(client.getAccounts(ACCESS_URL)).rejects.toMatchObject({
        errorType: ERRORS.SIMPLEFIN_PAYMENT_REQUIRED,
      });
    });
  });
});
