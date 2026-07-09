export type IUserRegisterPayload = {
  name: String;
  email: String;
  password: String;
  accountStatus?: String;
  role?: [];
};

export type IUserLoginType = {
  email: String;
  password: String;
};

export type ILoginReturnType = {
  id: string;
  name: string;
  email: string;
  accountStatus: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};
