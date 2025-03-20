import { IsNotEmpty, IsString } from "class-validator";


export class AttachmentLinkDto {
  @IsString()
  @IsNotEmpty()
  key: string;
}
