import { Module } from '@nestjs/common';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { BranchesController } from './Branches.controller';
import { CreateBranchService } from './commands/CreateBranch.service';
import { DeleteBranchService } from './commands/DeleteBranch.service';
import { EditBranchService } from './commands/EditBranch.service';
import { MarkBranchAsPrimaryService } from './commands/MarkBranchAsPrimary.service';
import { GetBranchService } from './queries/GetBranch.service';
import { GetBranchesService } from './queries/GetBranches.service';
import { ActivateBranches } from './commands/ActivateBranchesFeature.service';
import { BranchesApplication } from './BranchesApplication.service';
import { BranchesSettingsService } from './BranchesSettings';
import { BranchCommandValidator } from './commands/BranchCommandValidator.service';
import { BranchTransactionDTOTransformer } from './integrations/BranchTransactionDTOTransform';

@Module({
  imports: [TenancyDatabaseModule],
  controllers: [BranchesController],
  providers: [
    CreateBranchService,
    EditBranchService,
    DeleteBranchService,
    GetBranchService,
    GetBranchesService,
    MarkBranchAsPrimaryService,
    ActivateBranches,
    BranchesApplication,
    BranchesSettingsService,
    TenancyContext,
    TransformerInjectable,
    BranchCommandValidator,
    BranchTransactionDTOTransformer
  ],
  exports: [BranchTransactionDTOTransformer],
})
export class BranchesModule {}
