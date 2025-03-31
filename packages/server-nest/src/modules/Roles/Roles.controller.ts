import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Req,
  Res,
  Next,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { Injectable } from '@nestjs/common';
import { CreateRoleDto, EditRoleDto } from './dtos/Role.dto';
import { RolesApplication } from './Roles.application';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PublicRoute } from '../Auth/guards/Jwt.local';

@ApiTags('Roles')
@Controller('roles')
@PublicRoute()
export class RolesController {
  constructor(private readonly rolesApp: RolesApplication) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role created successfully',
  })
  async createRole(
    @Res() res: Response,
    @Next() next: NextFunction,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    const role = await this.rolesApp.createRole(createRoleDto);

    return res.status(HttpStatus.OK).send({
      data: { roleId: role.id },
      message: 'The role has been created successfully.',
    });
  }

  @Post(':id')
  @ApiOperation({ summary: 'Edit an existing role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiBody({ type: EditRoleDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role updated successfully',
  })
  async editRole(
    @Res() res: Response,
    @Next() next: NextFunction,
    @Param('id', ParseIntPipe) roleId: number,
    @Body() editRoleDto: EditRoleDto,
  ) {
    const role = await this.rolesApp.editRole(roleId, editRoleDto);

    return res.status(HttpStatus.OK).send({
      data: { roleId },
      message: 'The given role has been updated successfully.',
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role deleted successfully',
  })
  async deleteRole(
    @Res() res: Response,
    @Next() next: NextFunction,
    @Param('id', ParseIntPipe) roleId: number,
  ) {
    await this.rolesApp.deleteRole(roleId);

    return res.status(HttpStatus.OK).send({
      data: { roleId },
      message: 'The given role has been deleted successfully.',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of all roles' })
  async getRoles(@Res() res: Response) {
    const roles = await this.rolesApp.getRoles();

    return res.status(HttpStatus.OK).send({ roles });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Role details' })
  async getRole(
    @Res() res: Response,
    @Param('id', ParseIntPipe) roleId: number,
  ) {
    const role = await this.rolesApp.getRole(roleId);

    return res.status(HttpStatus.OK).send({ role });
  }
}
