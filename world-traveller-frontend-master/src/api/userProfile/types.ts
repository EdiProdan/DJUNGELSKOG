export type UserProfileResponse = {
  userId: number;
  isPublic: boolean;
  public: boolean;
  user: UserResponse;
  friends: UserResponse[];
};

export type UserResponse = {
  id: number;
  username: string;
  email: string;
  name: string;
  surname: string;
};

export type EditUserProfileCommand = {
  name: string;
  surname: string;
  email: string;
  publicProfile: boolean;
  image: number[];
};

export type UserProfilePictureResponse = {
  image: string;
};
