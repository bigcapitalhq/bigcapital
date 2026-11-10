import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SimpleFinApplication } from './SimpleFinApplication';
import {
  SimpleFinClaimTokenDto,
  SimpleFinClaimTokenResponseDto,
  SimpleFinLinkAccountsDto,
  SimpleFinLinkAccountsResponseDto,
} from './dtos/SimpleFin.dto';

@Controller('banking/simplefin')
@ApiTags('Banking SimpleFIN')
export class BankingSimpleFinController {
  constructor(private readonly simplefinApplication: SimpleFinApplication) {}

  @Post('claim-token')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Claim a SimpleFIN setup token and list the accounts available to link.',
  })
  @ApiResponse({ status: 200, type: SimpleFinClaimTokenResponseDto })
  async claimToken(
    @Body() claimDto: SimpleFinClaimTokenDto,
  ): Promise<SimpleFinClaimTokenResponseDto> {
    return this.simplefinApplication.claimToken(claimDto.setupToken);
  }

  @Post('link-accounts')
  @ApiOperation({
    summary:
      'Link the selected SimpleFIN accounts as bank/credit card accounts.',
  })
  @ApiResponse({ status: 201, type: SimpleFinLinkAccountsResponseDto })
  async linkAccounts(
    @Body() linkDto: SimpleFinLinkAccountsDto,
  ): Promise<SimpleFinLinkAccountsResponseDto> {
    const accountIds = await this.simplefinApplication.linkAccounts(linkDto);
    return { accountIds };
  }

  @Delete('items/:itemId')
  @ApiOperation({
    summary:
      'Remove a claimed SimpleFIN connection that has no linked accounts.',
  })
  @ApiResponse({ status: 200, description: 'SimpleFIN connection removed.' })
  async removeItem(@Param('itemId') itemId: string): Promise<void> {
    return this.simplefinApplication.removeUnlinkedItem(itemId);
  }
}
