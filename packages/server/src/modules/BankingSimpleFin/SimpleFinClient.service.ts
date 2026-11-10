import axios, { AxiosError } from 'axios';
import * as moment from 'moment';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from './constants';
import { parseSimpleFinAccessUrl } from './utils';
import {
  SimpleFinAccountSet,
  SimpleFinGetAccountsParams,
} from './types/BankingSimpleFin.types';

const REQUEST_TIMEOUT_MS = 60_000;

/**
 * Thin HTTP client for the SimpleFIN protocol.
 * @see https://www.simplefin.org/protocol.html
 */
@Injectable()
export class SimpleFinClient {
  private readonly logger = new Logger(SimpleFinClient.name);

  /**
   * Claims a setup token (POST to the decoded claim URL) and returns the
   * access URL that must be stored to query the user's accounts later.
   * @param {string} claimUrl - The decoded claim URL.
   * @returns {Promise<string>} The access URL.
   */
  public async claimAccessUrl(claimUrl: string): Promise<string> {
    try {
      const response = await axios.post<string>(claimUrl, undefined, {
        timeout: REQUEST_TIMEOUT_MS,
        responseType: 'text',
        headers: { 'Content-Length': '0' },
      });
      const accessUrl = String(response.data ?? '').trim();

      // Validate the returned access URL carries credentials.
      const { username, password } = parseSimpleFinAccessUrl(accessUrl);
      if (!username || !password) {
        throw new ServiceError(
          ERRORS.SIMPLEFIN_REQUEST_FAILED,
          'SimpleFIN returned an access URL without credentials.',
        );
      }
      return accessUrl;
    } catch (error) {
      if (error instanceof ServiceError) throw error;

      const status = (error as AxiosError)?.response?.status;

      // 403: the token does not exist or has already been claimed.
      if (status === HttpStatus.FORBIDDEN) {
        throw new ServiceError(
          ERRORS.SIMPLEFIN_SETUP_TOKEN_REJECTED,
          'The SimpleFIN setup token is invalid or has already been claimed.',
        );
      }
      this.logger.error(
        `Failed to claim the SimpleFIN setup token: ${(error as Error).message}`,
      );
      throw new ServiceError(
        ERRORS.SIMPLEFIN_REQUEST_FAILED,
        'Could not reach SimpleFIN to claim the setup token.',
      );
    }
  }

  /**
   * Retrieves the account set (accounts and optionally their transactions)
   * from the SimpleFIN server behind the given access URL.
   * @param {string} accessUrl - The stored access URL.
   * @param {SimpleFinGetAccountsParams} params
   * @returns {Promise<SimpleFinAccountSet>}
   */
  public async getAccounts(
    accessUrl: string,
    params: SimpleFinGetAccountsParams = {},
  ): Promise<SimpleFinAccountSet> {
    const { baseUrl, username, password } = parseSimpleFinAccessUrl(accessUrl);

    const search = new URLSearchParams();

    if (params.startDate) {
      search.set('start-date', String(moment(params.startDate).unix()));
    }
    if (params.endDate) {
      search.set('end-date', String(moment(params.endDate).unix()));
    }
    if (params.pending) {
      search.set('pending', '1');
    }
    if (params.balancesOnly) {
      search.set('balances-only', '1');
    }
    // The `account` parameter may be repeated to limit the results.
    (params.accountIds || []).forEach((accountId) =>
      search.append('account', accountId),
    );
    const query = search.toString();
    const url = `${baseUrl}/accounts${query ? `?${query}` : ''}`;

    try {
      const response = await axios.get<SimpleFinAccountSet>(url, {
        timeout: REQUEST_TIMEOUT_MS,
        auth: { username, password },
        headers: { Accept: 'application/json' },
      });
      const data = response.data || ({} as SimpleFinAccountSet);

      return {
        errors: Array.isArray(data.errors) ? data.errors : [],
        accounts: Array.isArray(data.accounts) ? data.accounts : [],
      };
    } catch (error) {
      const status = (error as AxiosError)?.response?.status;

      if (status === HttpStatus.FORBIDDEN) {
        throw new ServiceError(
          ERRORS.SIMPLEFIN_ACCESS_FORBIDDEN,
          'SimpleFIN rejected the stored access credentials. The connection may have been revoked.',
        );
      }
      if (status === HttpStatus.PAYMENT_REQUIRED) {
        throw new ServiceError(
          ERRORS.SIMPLEFIN_PAYMENT_REQUIRED,
          'The SimpleFIN subscription requires payment before data can be retrieved.',
        );
      }
      this.logger.error(
        `SimpleFIN accounts request failed: ${(error as Error).message}`,
      );
      throw new ServiceError(
        ERRORS.SIMPLEFIN_REQUEST_FAILED,
        'Could not retrieve accounts from SimpleFIN.',
      );
    }
  }
}
