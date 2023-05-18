import { List } from "lodash";

import { UserResponse } from "../../api/userProfile/types";

export type UserProfileResponse = {
  id: number;
  isPublic: boolean;
  user: UserResponse;
  friends: List<UserResponse>;
};
