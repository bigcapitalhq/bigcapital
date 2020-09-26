

export interface IRegisterDTO {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  organizationName: string,
};

export interface IPasswordReset {
  id: number,
  email: string,
  token: string,
  createdAt: Date,
};