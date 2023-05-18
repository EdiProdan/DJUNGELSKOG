export type RegisterCommand = {
  name: string;
  surname: string;
  email: string;
  username: string;
  password: string;
};

export type LoginCommand = {
  username: string;
  password: string;
};

export type JwtAuthenticatedResponse = {
  token: string;
  refreshToken: string;
  refreshExpiresAt: number;
};

export type AuthenticatedUserResponse = {
  id: number;
  username: string;
  email: string;
  active: boolean;
  name: string;
  surname: string;
  roles: string[];
};
