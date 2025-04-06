import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class AttachmentLinkDto {
  @IsString()
  @IsNotEmpty()
  key: string;
}


export class UnlinkAttachmentDto {
  @IsNotEmpty()
  modelRef: string;


  @IsNotEmpty()
  modelId: number;
}

export class LinkAttachmentDto {
  @IsNotEmpty()
  modelRef: string;


  @IsNotEmpty()
  modelId: number; 
}

export class UploadAttachmentDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}