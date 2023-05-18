import React from "react";

import { UserProfileResponse } from "../../api/userProfile/types";
import Useritem from "../UserItem/UserItem";

interface UserListProps {
  users: UserProfileResponse[];
}

export default function UserList({ users }: UserListProps) {
  return (
    <div className="flex flex-col gap-4 sm:p-10 p-4">
      {users.map((user) => (
        <Useritem key={user.user.id} userProfile={user} />
      ))}
    </div>
  );
}
