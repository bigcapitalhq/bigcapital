import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { BranchesApplication } from './BranchesApplication.service';
import { ICreateBranchDTO, IEditBranchDTO } from './Branches.types';
import { PublicRoute } from '../Auth/Jwt.guard';

@Controller('branches')
@PublicRoute()
export class BranchesController {
  constructor(private readonly branchesApplication: BranchesApplication) {}

  @Get()
  getBranches() {
    // return this.branchesApplication.getBranches();
  }

  @Get(':id')
  getBranch(@Param('id') id: string) {
    return this.branchesApplication.getBranch(Number(id));
  }

  @Post()
  createBranch(@Body() createBranchDTO: ICreateBranchDTO) {
    return this.branchesApplication.createBranch(createBranchDTO);
  }

  @Put(':id')
  editBranch(@Param('id') id: string, @Body() editBranchDTO: IEditBranchDTO) {
    return this.branchesApplication.editBranch(Number(id), editBranchDTO);
  }

  @Delete(':id')
  deleteBranch(@Param('id') id: string) {
    return this.branchesApplication.deleteBranch(Number(id));
  }

  @Post('activate')
  activateBranches() {
    return this.branchesApplication.activateBranches();
  }

  @Put(':id/mark-as-primary')
  markBranchAsPrimary(@Param('id') id: string) {
    return this.branchesApplication.markBranchAsPrimary(Number(id));
  }
}
