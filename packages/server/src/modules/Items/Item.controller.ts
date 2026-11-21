import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Patch,
  Get,
  Put,
  Query,
  HttpCode,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TenantController } from '../Tenancy/Tenant.controller';
import { ItemsApplicationService } from './ItemsApplication.service';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateItemDto, EditItemDto } from './dtos/Item.dto';
import { GetItemsQueryDto } from './dtos/GetItemsQuery.dto';
import { ItemResponseDto } from './dtos/itemResponse.dto';
import {
  ItemImageResponseDto,
  UploadItemImagesDto,
  UploadItemImagesResponseDto,
} from './dtos/ItemImage.dto';
import { ItemActionResponseDto } from './dtos/ItemActionResponse.dto';
import { PaginatedResponseDto } from '@/common/dtos/PaginatedResults.dto';
import { ItemInvoiceResponseDto } from './dtos/ItemInvoiceResponse.dto';
import { ItemEstimatesResponseDto } from './dtos/ItemEstimatesResponse.dto';
import { ItemBillsResponseDto } from './dtos/ItemBillsResponse.dto';
import { ItemReceiptsResponseDto } from './dtos/ItemReceiptsResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import {
  BulkDeleteItemsDto,
  ValidateBulkDeleteItemsResponseDto,
} from './dtos/BulkDeleteItems.dto';
import { ItemApiErrorResponseDto } from './dtos/ItemErrorResponse.dto';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ItemAction } from '@/interfaces/Item';
import { FilesInterceptor } from '@/common/interceptors/file.interceptor';
import { uploadItemImagesMulterOptions } from './ItemImages.multer';
import { ITEM_IMAGE_TYPES, MAX_ITEM_IMAGES } from './Items.constants';

@Controller('/items')
@ApiTags('Items')
@ApiExtraModels(ItemResponseDto)
@ApiExtraModels(PaginatedResponseDto)
@ApiExtraModels(ItemInvoiceResponseDto)
@ApiExtraModels(ItemEstimatesResponseDto)
@ApiExtraModels(ItemBillsResponseDto)
@ApiExtraModels(ItemEstimatesResponseDto)
@ApiExtraModels(ItemReceiptsResponseDto)
@ApiExtraModels(ValidateBulkDeleteItemsResponseDto)
@ApiExtraModels(ItemApiErrorResponseDto)
@ApiExtraModels(ItemImageResponseDto)
@ApiExtraModels(UploadItemImagesResponseDto)
@ApiExtraModels(ItemActionResponseDto)
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class ItemsController extends TenantController {
  constructor(private readonly itemsApplication: ItemsApplicationService) {
    super();
  }

  @Get()
  @RequirePermission(ItemAction.VIEW, AbilitySubject.Item)
  @ApiOperation({ summary: 'Retrieves the item list.' })
  @ApiResponse({
    status: 200,
    description: 'The item list has been successfully retrieved.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(ItemResponseDto) },
            },
          },
        },
      ],
    },
  })
  @ApiQuery({
    name: 'customViewId',
    required: false,
    type: Number,
    description: 'Custom view ID for filtering',
  })
  @ApiQuery({
    name: 'filterRoles',
    required: false,
    type: Array,
    description: 'Array of filter roles',
  })
  @ApiQuery({
    name: 'columnSortBy',
    required: false,
    type: String,
    description: 'Column sort direction',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    enum: ['DESC', 'ASC'],
    description: 'Sort order direction',
  })
  @ApiQuery({
    name: 'stringifiedFilterRoles',
    required: false,
    type: String,
    description: 'Stringified filter roles',
  })
  @ApiQuery({
    name: 'searchKeyword',
    required: false,
    type: String,
    description: 'Search keyword',
  })
  @ApiQuery({
    name: 'viewSlug',
    required: false,
    type: String,
    description: 'View slug for filtering',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'inactiveMode',
    required: false,
    type: Boolean,
    description: 'Filter for inactive items',
  })
  async getItems(@Query() filterDTO: GetItemsQueryDto): Promise<any> {
    return this.itemsApplication.getItems(filterDTO);
  }

  /**
   * Edit item.
   * @param id - The item id.
   * @param editItemDto - The item DTO.
   * @returns The updated item id.
   */
  @Put(':id')
  @RequirePermission(ItemAction.EDIT, AbilitySubject.Item)
  @ApiOperation({ summary: 'Edit the given item (product or service).' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully updated.',
    type: ItemActionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Validation error. Possible error types: ITEM_NAME_EXISTS, INVENTORY_ACCOUNT_CANNOT_MODIFIED, TYPE_CANNOT_CHANGE_WITH_ITEM_HAS_TRANSACTIONS, etc.',
    schema: {
      $ref: getSchemaPath(ItemApiErrorResponseDto),
    },
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  async editItem(
    @Param('id') id: string,
    @Body() editItemDto: EditItemDto,
  ): Promise<{ id: number; message: string }> {
    const itemId = parseInt(id, 10);
    await this.itemsApplication.editItem(itemId, editItemDto);
    return { id: itemId, message: 'The item has been successfully updated.' };
  }

  /**
   * Uploads item images (front, rear, or other).
   */
  @Post(':id/images')
  @HttpCode(200)
  @RequirePermission(ItemAction.EDIT, AbilitySubject.Item)
  @UseInterceptors(
    FilesInterceptor('files', MAX_ITEM_IMAGES, uploadItemImagesMulterOptions),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload item images.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        type: { type: 'string', enum: [...ITEM_IMAGE_TYPES] },
      },
      required: ['files', 'type'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'The item images have been uploaded successfully.',
    type: UploadItemImagesResponseDto,
  })
  @ApiParam({ name: 'id', required: true, type: Number })
  async uploadItemImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() uploadItemImagesDto: UploadItemImagesDto,
  ): Promise<UploadItemImagesResponseDto> {
    return this.itemsApplication.addItemImages(
      parseInt(id, 10),
      files,
      uploadItemImagesDto.type,
    );
  }

  /**
   * Deletes the given item image.
   */
  @Delete(':id/images/:imageId')
  @RequirePermission(ItemAction.EDIT, AbilitySubject.Item)
  @ApiOperation({ summary: 'Delete the given item image.' })
  @ApiResponse({
    status: 200,
    description: 'The item image has been successfully deleted.',
  })
  @ApiParam({ name: 'id', required: true, type: Number })
  @ApiParam({ name: 'imageId', required: true, type: Number })
  async deleteItemImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
  ): Promise<void> {
    return this.itemsApplication.deleteItemImage(
      parseInt(id, 10),
      parseInt(imageId, 10),
    );
  }

  @Post('validate-bulk-delete')
  @HttpCode(200)
  @RequirePermission(ItemAction.DELETE, AbilitySubject.Item)
  @ApiOperation({
    summary:
      'Validates which items can be deleted and returns counts of deletable and non-deletable items.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Validation completed. Returns counts and IDs of deletable and non-deletable items.',
    schema: {
      $ref: getSchemaPath(ValidateBulkDeleteItemsResponseDto),
    },
  })
  async validateBulkDeleteItems(
    @Body() bulkDeleteDto: BulkDeleteItemsDto,
  ): Promise<ValidateBulkDeleteItemsResponseDto> {
    return this.itemsApplication.validateBulkDeleteItems(bulkDeleteDto.ids);
  }

  @Post('bulk-delete')
  @HttpCode(200)
  @RequirePermission(ItemAction.DELETE, AbilitySubject.Item)
  @ApiOperation({ summary: 'Deletes multiple items in bulk.' })
  @ApiResponse({
    status: 200,
    description: 'The items have been successfully deleted.',
  })
  async bulkDeleteItems(
    @Body() bulkDeleteDto: BulkDeleteItemsDto,
  ): Promise<void> {
    return this.itemsApplication.bulkDeleteItems(bulkDeleteDto.ids, {
      skipUndeletable: bulkDeleteDto.skipUndeletable ?? false,
    });
  }

  @Post()
  @RequirePermission(ItemAction.CREATE, AbilitySubject.Item)
  @ApiOperation({ summary: 'Create a new item (product or service).' })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully created.',
    type: ItemActionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Validation error. Possible error types: ITEM_NAME_EXISTS, ITEM_CATEOGRY_NOT_FOUND, COST_ACCOUNT_NOT_COGS, SELL_ACCOUNT_NOT_INCOME, INVENTORY_ACCOUNT_NOT_INVENTORY, INCOME_ACCOUNT_REQUIRED_WITH_SELLABLE_ITEM, COST_ACCOUNT_REQUIRED_WITH_PURCHASABLE_ITEM, etc.',
    schema: {
      $ref: getSchemaPath(ItemApiErrorResponseDto),
    },
  })
  // @UsePipes(new ZodValidationPipe(createItemSchema))
  async createItem(
    @Body() createItemDto: CreateItemDto,
  ): Promise<{ id: number; message: string }> {
    const itemId = await this.itemsApplication.createItem(createItemDto);

    return { id: itemId, message: 'The item has been successfully created.' };
  }

  @Delete(':id')
  @RequirePermission(ItemAction.DELETE, AbilitySubject.Item)
  @ApiOperation({ summary: 'Delete the given item (product or service).' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully deleted.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Cannot delete item. Possible error types: ITEM_HAS_ASSOCIATED_TRANSACTINS, ITEM_HAS_ASSOCIATED_INVENTORY_ADJUSTMENT, etc.',
    schema: {
      $ref: getSchemaPath(ItemApiErrorResponseDto),
    },
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  async deleteItem(@Param('id') id: string): Promise<void> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.deleteItem(itemId);
  }

  @Patch(':id/inactivate')
  @RequirePermission(ItemAction.EDIT, AbilitySubject.Item)
  @ApiOperation({ summary: 'Inactivate the given item (product or service).' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully inactivated.',
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  async inactivateItem(@Param('id') id: string): Promise<void> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.inactivateItem(itemId);
  }

  @Patch(':id/activate')
  @RequirePermission(ItemAction.EDIT, AbilitySubject.Item)
  @ApiOperation({ summary: 'Activate the given item (product or service).' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully activated.',
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  async activateItem(@Param('id') id: string): Promise<void> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.activateItem(itemId);
  }

  @Get(':id')
  @RequirePermission(ItemAction.VIEW, AbilitySubject.Item)
  @ApiOperation({ summary: 'Get the given item (product or service).' })
  @ApiResponse({
    status: 200,
    description: 'The item details have been successfully retrieved.',
    schema: {
      $ref: getSchemaPath(ItemResponseDto),
    },
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  async getItem(@Param('id') id: string): Promise<any> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.getItem(itemId);
  }

  @Get(':id/invoices')
  @RequirePermission(ItemAction.VIEW, AbilitySubject.Item)
  @ApiOperation({
    summary: 'Retrieves the item associated invoices transactions.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The item associated invoices transactions have been successfully retrieved.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(ItemInvoiceResponseDto) },
    },
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  async getItemInvoicesTransactions(@Param('id') id: string): Promise<any> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.getItemInvoicesTransactions(itemId);
  }

  @Get(':id/bills')
  @RequirePermission(ItemAction.VIEW, AbilitySubject.Item)
  @ApiOperation({
    summary: 'Retrieves the item associated bills transactions.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The item associated bills transactions have been successfully retrieved.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(ItemBillsResponseDto) },
    },
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  async getItemBillTransactions(@Param('id') id: string): Promise<any> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.getItemBillTransactions(itemId);
  }

  @Get(':id/estimates')
  @RequirePermission(ItemAction.VIEW, AbilitySubject.Item)
  @ApiOperation({
    summary: 'Retrieves the item associated estimates transactions.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The item associated estimate transactions have been successfully retrieved.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(ItemEstimatesResponseDto) },
    },
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  async getItemEstimatesTransactions(@Param('id') id: string): Promise<any> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.getItemEstimatesTransactions(itemId);
  }

  @Get(':id/receipts')
  @RequirePermission(ItemAction.VIEW, AbilitySubject.Item)
  @ApiOperation({
    summary: 'Retrieves the item associated receipts transactions.',
  })
  @ApiResponse({
    status: 200,
    description:
      'The item associated receipts transactions have been successfully retrieved.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(ItemReceiptsResponseDto) },
    },
  })
  @ApiResponse({ status: 404, description: 'The item not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The item id',
  })
  async getItemReceiptTransactions(@Param('id') id: string): Promise<any> {
    const itemId = parseInt(id, 10);
    return this.itemsApplication.getItemReceiptsTransactions(itemId);
  }
}
