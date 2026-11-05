import { Injectable } from '@nestjs/common';
import { ClaimSimpleFinTokenService } from './commands/ClaimSimpleFinToken.service';
import { LinkSimpleFinAccountsService } from './commands/LinkSimpleFinAccounts.service';
import { DisconnectSimpleFinItemService } from './commands/DisconnectSimpleFinItem.service';
import { SimpleFinLinkAccountsDto } from './dtos/SimpleFin.dto';
import { SimpleFinClaimTokenResult } from './types/BankingSimpleFin.types';

@Injectable()
export class SimpleFinApplication {
  constructor(
    private readonly claimTokenService: ClaimSimpleFinTokenService,
    private readonly linkAccountsService: LinkSimpleFinAccountsService,
    private readonly disconnectItemService: DisconnectSimpleFinItemService,
  ) {}

  /**
   * Claims the SimpleFIN setup token and lists the available accounts.
   * @param {string} setupToken
   * @returns {Promise<SimpleFinClaimTokenResult>}
   */
  public claimToken(setupToken: string): Promise<SimpleFinClaimTokenResult> {
    return this.claimTokenService.claimToken(setupToken);
  }

  /**
   * Links the selected SimpleFIN accounts as bank/credit card accounts.
   * @param {SimpleFinLinkAccountsDto} linkDTO
   * @returns {Promise<number[]>}
   */
  public linkAccounts(linkDTO: SimpleFinLinkAccountsDto): Promise<number[]> {
    return this.linkAccountsService.linkAccounts(linkDTO);
  }

  /**
   * Removes a claimed SimpleFIN item that has no linked accounts.
   * @param {string} simplefinItemId
   * @returns {Promise<void>}
   */
  public removeUnlinkedItem(simplefinItemId: string): Promise<void> {
    return this.disconnectItemService.removeUnlinkedItem(simplefinItemId);
  }
}
