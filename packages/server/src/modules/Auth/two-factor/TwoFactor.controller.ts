import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ClsService } from 'nestjs-cls';
import { TenantAgnosticRoute } from '@/modules/Tenancy/TenancyGlobal.guard';
import { TwoFactorService } from './TwoFactor.service';
import { RejectApiKeyGuard } from './RejectApiKey.guard';
import { AllowWithoutTwoFactor } from './TwoFactor.constants';
import {
  TwoFactorConfirmSetupDto,
  TwoFactorRecoveryCodesResponseDto,
  TwoFactorSetupResponseDto,
  TwoFactorStatusResponseDto,
  TwoFactorVerifyDto,
} from './dtos/TwoFactor.dto';

/**
 * Two-factor authentication of the signed-in user.
 */
@Controller('/auth/two-factor')
@ApiTags('Auth')
@ApiExtraModels(
  TwoFactorStatusResponseDto,
  TwoFactorSetupResponseDto,
  TwoFactorRecoveryCodesResponseDto,
)
@TenantAgnosticRoute()
@AllowWithoutTwoFactor()
@UseGuards(RejectApiKeyGuard)
@Throttle({ auth: {} })
export class TwoFactorController {
  constructor(
    private readonly twoFactorService: TwoFactorService,
    private readonly clsService: ClsService,
  ) {}

  private get userId(): number {
    return this.clsService.get<number>('userId');
  }

  @Get()
  @ApiOperation({ summary: 'Two-factor status of the signed-in user' })
  @ApiResponse({
    status: 200,
    schema: { $ref: getSchemaPath(TwoFactorStatusResponseDto) },
  })
  status(): Promise<TwoFactorStatusResponseDto> {
    return this.twoFactorService.getStatus(this.userId);
  }

  @Post('/setup')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Start the setup: returns a new secret and its otpauth URI (pending until confirmed)',
  })
  @ApiResponse({
    status: 200,
    schema: { $ref: getSchemaPath(TwoFactorSetupResponseDto) },
  })
  startSetup(): Promise<TwoFactorSetupResponseDto> {
    return this.twoFactorService.startSetup(this.userId);
  }

  @Post('/setup/confirm')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Confirm the setup with a code: turns two-factor on and returns the recovery codes',
  })
  @ApiBody({ type: TwoFactorConfirmSetupDto })
  @ApiResponse({
    status: 200,
    schema: { $ref: getSchemaPath(TwoFactorRecoveryCodesResponseDto) },
  })
  async confirmSetup(
    @Body() body: TwoFactorConfirmSetupDto,
  ): Promise<TwoFactorRecoveryCodesResponseDto> {
    const recoveryCodes = await this.twoFactorService.confirmSetup(
      this.userId,
      body.code,
    );
    return { recoveryCodes };
  }

  @Post('/recovery-codes')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Replace the recovery codes (password and a code required)',
  })
  @ApiBody({ type: TwoFactorVerifyDto })
  @ApiResponse({
    status: 200,
    schema: { $ref: getSchemaPath(TwoFactorRecoveryCodesResponseDto) },
  })
  async regenerateRecoveryCodes(
    @Body() body: TwoFactorVerifyDto,
  ): Promise<TwoFactorRecoveryCodesResponseDto> {
    const recoveryCodes = await this.twoFactorService.regenerateRecoveryCodes(
      this.userId,
      body.password,
      { code: body.code, recoveryCode: body.recoveryCode },
    );
    return { recoveryCodes };
  }

  @Post('/disable')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Turn two-factor off (password and a code required)',
  })
  @ApiBody({ type: TwoFactorVerifyDto })
  @ApiResponse({ status: 200 })
  async disable(@Body() body: TwoFactorVerifyDto) {
    await this.twoFactorService.disable(this.userId, body.password, {
      code: body.code,
      recoveryCode: body.recoveryCode,
    });
    return {
      code: 200,
      message: 'Two-factor authentication has been turned off.',
    };
  }
}
