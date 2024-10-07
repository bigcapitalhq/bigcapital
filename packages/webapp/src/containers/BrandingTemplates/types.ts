

export interface BrandingTemplateValues {
  templateName: string;

  // Company logo
  companyLogoKey?: string;
  companyLogoUri?: string;
}

export interface BrandingState extends ElementPreviewState {
  companyName: string;
  companyAddress: string;

  companyLogoKey: string;
  companyLogoUri: string;

  primaryColor: string;
}

export interface ElementPreviewState {

}