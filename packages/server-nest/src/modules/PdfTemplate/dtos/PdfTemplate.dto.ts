import { IsObject, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class CreatePdfTemplateDto {
  @IsString()
  @IsNotEmpty()
  templateName: string;

  @IsString()
  @IsNotEmpty()
  resource: string;

  @IsObject()
  @IsNotEmpty()
  attributes: Record<string, any>;
}

export class EditPdfTemplateDto {
  @IsString()
  @IsNotEmpty()
  templateName: string;

  @IsString()
  @IsNotEmpty()
  resource: string;

  @IsObject()
  @IsNotEmpty()
  attributes: Record<string, any>;
}
