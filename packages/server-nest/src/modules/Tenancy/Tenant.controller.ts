import { UseGuards } from '@nestjs/common';
import { EnsureTenantIsSeededGuard } from '../Tenancy/EnsureTenantIsSeeded.guards';
import { EnsureTenantIsInitializedGuard } from '../Tenancy/EnsureTenantIsInitialized.guard';

@UseGuards(EnsureTenantIsInitializedGuard)
@UseGuards(EnsureTenantIsSeededGuard)
export class TenantController {}
