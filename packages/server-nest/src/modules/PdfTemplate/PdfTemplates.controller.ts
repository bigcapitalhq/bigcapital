import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PdfTemplateApplication } from './PdfTemplate.application';
import { ICreateInvoicePdfTemplateDTO, IEditPdfTemplateDTO } from './types';
import { PublicRoute } from '../Auth/Jwt.guard';

@Controller('pdf-templates')
@PublicRoute()
export class PdfTemplatesController {
  constructor(private readonly pdfTemplateApplication: PdfTemplateApplication) {}

  @Post()
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
  async deletePdfTemplate(@Param('id') templateId: number) {
    return this.pdfTemplateApplication.deletePdfTemplate(templateId);
  }

  @Get(':id')
  async getPdfTemplate(@Param('id') templateId: number) {
    return this.pdfTemplateApplication.getPdfTemplate(templateId);
  }

  @Get()
  async getPdfTemplates(@Body('resource') resource: string) {
    return this.pdfTemplateApplication.getPdfTemplates(resource);
  }

  @Put(':id')
  async editPdfTemplate(
    @Param('id') templateId: number,
    @Body() editDTO: IEditPdfTemplateDTO,
  ) {
    return this.pdfTemplateApplication.editPdfTemplate(templateId, editDTO);
  }

  @Put(':id/assign-default')
  async assignPdfTemplateAsDefault(@Param('id') templateId: number) {
    return this.pdfTemplateApplication.assignPdfTemplateAsDefault(templateId);
  }
}
