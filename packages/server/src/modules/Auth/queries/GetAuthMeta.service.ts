import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAuthGetMetaPOJO } from '../Auth.interfaces';

@Injectable()
export class GetAuthMetaService {

  constructor(
    private readonly configService: ConfigService,
  ) {

  }
  /**
   * Retrieves the authentication meta for SPA.
   * @returns {Promise<IAuthGetMetaPOJO>}
   */
  public async getAuthMeta(): Promise<IAuthGetMetaPOJO> {
    return {
      signupDisabled: this.configService.get('signupRestrictions.disabled'),
    };
  }
}
