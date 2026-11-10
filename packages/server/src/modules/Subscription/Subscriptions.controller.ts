import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { SubscriptionApplication } from './SubscriptionApplication';
import { IgnoreTenantInitializedRoute } from '../Tenancy/EnsureTenantIsInitialized.guard';
import { IgnoreTenantSeededRoute } from '../Tenancy/EnsureTenantIsSeeded.guards';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { AuthorizationGuard } from '../Roles/Authorization.guard';
import { PermissionGuard } from '../Roles/Permission.guard';
import { RequirePermission } from '../Roles/RequirePermission.decorator';
import { SkipSubscriptionCheck } from './decorators/SkipSubscriptionCheck.decorator';
import { SubscriptionResponseDto } from './dtos/SubscriptionResponse.dto';
import { SubscriptionsListResponseDto } from './dtos/SubscriptionsListResponse.dto';
import { GetSubscriptionPlansResponseDto } from './dtos/SubscriptionPlansResponse.dto';
import {
  ChangeSubscriptionPlanBodyDto,
  CreateStripeCheckoutSessionBodyDto,
  SyncStripeCheckoutSessionBodyDto,
} from './dtos/StripeBillingBody.dto';
import {
  StripeCheckoutSessionResponseDto,
  StripeSessionResponseDto,
  StripeSyncCheckoutSessionResponseDto,
} from './dtos/StripeSessionResponse.dto';

@Controller('subscription')
@ApiTags('Subscriptions')
@ApiExtraModels(
  SubscriptionResponseDto,
  SubscriptionsListResponseDto,
  GetSubscriptionPlansResponseDto,
  StripeCheckoutSessionResponseDto,
  StripeSessionResponseDto,
  StripeSyncCheckoutSessionResponseDto,
)
@IgnoreTenantInitializedRoute()
@IgnoreTenantSeededRoute()
@SkipSubscriptionCheck()
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionApp: SubscriptionApplication) {}

  @Get()
  @ApiOperation({ summary: 'Get all subscriptions for the current tenant' })
  @ApiResponse({
    status: 200,
    description: 'List of subscriptions retrieved successfully',
    schema: { $ref: getSchemaPath(SubscriptionsListResponseDto) },
  })
  @HttpCode(200)
  async getSubscriptions() {
    const subscriptions = await this.subscriptionApp.getSubscriptions();

    return { subscriptions };
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get the Bigcapital Cloud plan catalog' })
  @ApiResponse({
    status: 200,
    description: 'Plan catalog retrieved successfully',
    schema: { $ref: getSchemaPath(GetSubscriptionPlansResponseDto) },
  })
  @HttpCode(200)
  async getPlans() {
    const plans = await this.subscriptionApp.getPlans();

    return { plans };
  }

  @Post('stripe/checkout_session')
  @RequirePermission('manage', 'all')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Create a Stripe Checkout session for a subscription plan',
  })
  @ApiBody({ type: CreateStripeCheckoutSessionBodyDto })
  @ApiResponse({
    status: 200,
    description: 'Checkout session created successfully',
    schema: { $ref: getSchemaPath(StripeCheckoutSessionResponseDto) },
  })
  async createCheckoutSession(
    @Body() body: CreateStripeCheckoutSessionBodyDto,
  ) {
    return this.subscriptionApp.createCheckoutSession(body.planSlug);
  }

  @Post('stripe/portal_session')
  @RequirePermission('manage', 'all')
  @HttpCode(200)
  @ApiOperation({ summary: 'Create a Stripe Customer Portal session' })
  @ApiResponse({
    status: 200,
    description: 'Portal session created successfully',
    schema: { $ref: getSchemaPath(StripeSessionResponseDto) },
  })
  async createPortalSession() {
    return this.subscriptionApp.createPortalSession();
  }

  @Post('stripe/sync')
  @RequirePermission('manage', 'all')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Synchronize a completed Stripe Checkout session',
  })
  @ApiBody({ type: SyncStripeCheckoutSessionBodyDto })
  @ApiResponse({
    status: 200,
    description: 'Checkout session synchronized successfully',
    schema: { $ref: getSchemaPath(StripeSyncCheckoutSessionResponseDto) },
  })
  async syncCheckoutSession(@Body() body: SyncStripeCheckoutSessionBodyDto) {
    await this.subscriptionApp.syncCheckoutSession(body.sessionId);

    return { status: 'synced' };
  }

  @Post('change')
  @RequirePermission('manage', 'all')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Change the subscription plan of the current organization',
  })
  @ApiBody({ type: ChangeSubscriptionPlanBodyDto })
  @ApiResponse({
    status: 200,
    description: 'Subscription plan changed successfully',
  })
  async changeSubscriptionPlan(@Body() body: ChangeSubscriptionPlanBodyDto) {
    await this.subscriptionApp.changeSubscriptionPlan(body.planSlug);

    return { message: 'The subscription plan has been changed.' };
  }

  @Post('cancel')
  @RequirePermission('manage', 'all')
  @HttpCode(200)
  @ApiOperation({ summary: 'Cancel the current organization subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription canceled successfully',
  })
  async cancelSubscription() {
    await this.subscriptionApp.cancelSubscription();

    return {
      status: 200,
      message: 'The organization subscription has been canceled.',
    };
  }

  @Post('resume')
  @RequirePermission('manage', 'all')
  @HttpCode(200)
  @ApiOperation({ summary: 'Resume the current organization subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription resumed successfully',
  })
  async resumeSubscription() {
    await this.subscriptionApp.resumeSubscription();

    return {
      status: 200,
      message: 'The organization subscription has been resumed.',
    };
  }
}
