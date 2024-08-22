import { IAuthSignInPOJO } from '@/interfaces';

export interface ICreateOneClickDemoPOJO {
  email: string;
  demoId: string;
  signedIn: IAuthSignInPOJO;
  buildJob: any;
}
