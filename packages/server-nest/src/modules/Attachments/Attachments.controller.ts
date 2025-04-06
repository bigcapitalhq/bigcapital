import mime from 'mime-types';
import { Response, NextFunction, Request } from 'express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  LinkAttachmentDto,
  UnlinkAttachmentDto,
  UploadAttachmentDto,
} from './dtos/Attachment.dto';
import { AttachmentsApplication } from './AttachmentsApplication';
import { AttachmentUploadPipeline } from './S3UploadPipeline';
import { FileInterceptor } from '@/common/interceptors/file.interceptor';
import { ConfigService } from '@nestjs/config';

@ApiTags('Attachments')
@Controller('/attachments')
export class AttachmentsController {
  /**
   * @param {AttachmentsApplication} attachmentsApplication - Attachments application.
   * @param uploadPipelineService
   */
  constructor(
    private readonly attachmentsApplication: AttachmentsApplication,
    private readonly uploadPipelineService: AttachmentUploadPipeline,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Uploads the attachments to S3 and store the file metadata to DB.
   */
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload attachment to S3' })
  @ApiBody({ description: 'Upload attachment', type: UploadAttachmentDto })
  @ApiResponse({
    status: 200,
    description: 'The document has been uploaded successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - File upload failed',
  })
  async uploadAttachment(
    @UploadedFile() file: Express.Multer.File,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    if (!file) {
      throw new UnauthorizedException({
        errorType: 'FILE_UPLOAD_FAILED',
        message: 'Now file uploaded.',
      });
    }
    const data = await this.attachmentsApplication.upload(file);

    return res.status(200).send({
      status: 200,
      message: 'The document has uploaded successfully.',
      data,
    });
  }

  /**
   * Retrieves the given attachment key.
   */
  @Get('/:id')
  @ApiOperation({ summary: 'Get attachment by ID' })
  @ApiParam({ name: 'id', description: 'Attachment ID' })
  @ApiResponse({ status: 200, description: 'Returns the attachment file' })
  async getAttachment(
    @Res() res: Response,
    @Param('id') documentId: string,
  ): Promise<Response | void> {
    const data = await this.attachmentsApplication.get(documentId);

    const byte = await data.Body.transformToByteArray();
    const extension = mime.extension(data.ContentType);
    const buffer = Buffer.from(byte);

    res.set('Content-Disposition', `filename="${documentId}.${extension}"`);
    res.set('Content-Type', data.ContentType);
    res.send(buffer);
  }

  /**
   * Deletes the given document key.
   */
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete attachment by ID' })
  @ApiParam({ name: 'id', description: 'Attachment ID' })
  @ApiResponse({
    status: 200,
    description: 'The document has been deleted successfully',
  })
  async deleteAttachment(
    @Res() res: Response,
    @Param('id') documentId: string,
  ): Promise<Response | void> {
    await this.attachmentsApplication.delete(documentId);

    return res.status(200).send({
      status: 200,
      message: 'The document has been delete successfully.',
    });
  }

  /**
   * Links the given document key.
   */
  @Post('/:id/link')
  @ApiOperation({ summary: 'Link attachment to a model' })
  @ApiParam({ name: 'id', description: 'Attachment ID' })
  @ApiBody({ type: LinkAttachmentDto })
  @ApiResponse({
    status: 200,
    description: 'The document has been linked successfully',
  })
  async linkDocument(
    @Body() linkDocumentDto: LinkAttachmentDto,
    @Param('id') documentId: string,
    @Res() res: Response,
  ): Promise<Response | void> {
    await this.attachmentsApplication.link(
      documentId,
      linkDocumentDto.modelRef,
      linkDocumentDto.modelId,
    );

    return res.status(200).send({
      status: 200,
      message: 'The document has been linked successfully.',
    });
  }

  /**
   * Links the given document key.
   */
  @Post('/:id/unlink')
  @ApiOperation({ summary: 'Unlink attachment from a model' })
  @ApiParam({ name: 'id', description: 'Attachment ID' })
  @ApiBody({ type: UnlinkAttachmentDto })
  @ApiResponse({
    status: 200,
    description: 'The document has been unlinked successfully',
  })
  async unlinkDocument(
    @Body() unlinkDto: UnlinkAttachmentDto,
    @Param('id') documentId: string,
    @Res() res: Response,
  ): Promise<Response | void> {
    await this.attachmentsApplication.link(
      documentId,
      unlinkDto.modelRef,
      unlinkDto.modelId,
    );

    return res.status(200).send({
      status: 200,
      message: 'The document has been linked successfully.',
    });
  }

  /**
   * Retreives the presigned url of the given attachment key.
   */
  @Get('/:id/presigned-url')
  @ApiOperation({ summary: 'Get presigned URL for attachment' })
  @ApiParam({ name: 'id', description: 'Attachment ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the presigned URL for the attachment',
  })
  async getAttachmentPresignedUrl(
    @Param('id') documentKey: string,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    const presignedUrl =
      await this.attachmentsApplication.getPresignedUrl(documentKey);

    return res.status(200).send({ presignedUrl });
  }
}
