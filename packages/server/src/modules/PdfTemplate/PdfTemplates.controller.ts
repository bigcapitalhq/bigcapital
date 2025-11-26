import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PdfTemplateApplication } from './PdfTemplate.application';
import { ICreateInvoicePdfTemplateDTO, IEditPdfTemplateDTO } from './types';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('pdf-templates')
@ApiTags('Pdf Templates')
@ApiCommonHeaders()
export class PdfTemplatesController {
  constructor(
    private readonly pdfTemplateApplication: PdfTemplateApplication,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PDF template.' })
  @ApiResponse({
    status: 200,
    description: 'The PDF template has been successfully created.',
  })
  async createPdfTemplate(
    @Body('templateName') templateName: string,
    @Body('resource') resource: string,
    @Body() invoiceTemplateDTO: ICreateInvoicePdfTemplateDTO,
  ) {
    return this.pdfTemplateApplication.createPdfTemplate(
      templateName,
      resource,
      invoiceTemplateDTO,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given PDF template.' })
  @ApiResponse({
    status: 200,
    description: 'The PDF template has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'The PDF template not found.' })
  async deletePdfTemplate(@Param('id') templateId: number) {
    return this.pdfTemplateApplication.deletePdfTemplate(templateId);
  }

  @Get('/state')
  @ApiOperation({ summary: 'Retrieves the PDF template branding state.' })
  @ApiResponse({
    status: 200,
    description:
      'The PDF template branding state has been successfully retrieved.',
  })
  async getPdfTemplateBrandingState() {
    return this.pdfTemplateApplication.getPdfTemplateBrandingState();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the PDF template details.' })
  @ApiResponse({
    status: 200,
    description: 'The PDF template details have been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'The PDF template not found.' })
  async getPdfTemplate(@Param('id') templateId: number) {
    return this.pdfTemplateApplication.getPdfTemplate(templateId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the PDF templates.' })
  @ApiResponse({
    status: 200,
    description: 'The PDF templates have been successfully retrieved.',
  })
  async getPdfTemplates(@Query('resource') resource?: string) {
    return this.pdfTemplateApplication.getPdfTemplates({ resource });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given PDF template.' })
  @ApiResponse({
    status: 200,
    description: 'The PDF template has been successfully edited.',
  })
  @ApiResponse({ status: 404, description: 'The PDF template not found.' })
  async editPdfTemplate(
    @Param('id') templateId: number,
    @Body() editDTO: IEditPdfTemplateDTO,
  ) {
    return this.pdfTemplateApplication.editPdfTemplate(templateId, editDTO);
  }

  @Put(':id/assign-default')
  @ApiOperation({ summary: 'Assign the given PDF template as default.' })
  @ApiResponse({
    status: 200,
    description: 'The PDF template has been successfully assigned as default.',
  })
  @ApiResponse({ status: 404, description: 'The PDF template not found.' })
  async assignPdfTemplateAsDefault(@Param('id') templateId: number) {
    return this.pdfTemplateApplication.assignPdfTemplateAsDefault(templateId);
  }
}
