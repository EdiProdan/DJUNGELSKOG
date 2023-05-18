import React from "react";

import { SearchIcon } from "@heroicons/react/outline";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";

import paths from "../../api/paths";
import { UserProfileResponse } from "../../api/userProfile/types";
import { useClient } from "../../components/ClientProvider/ClientProvider";
import SearchBar from "../../components/SearchBar/SearchBar";
import UserList from "../../components/UserList/UserList";

export default function SearchUser() {
  const { client } = useClient();

  const { data, isLoading } = useQuery<UserProfileResponse[], string>({
    queryKey: ["users"],
    queryFn: () => client.get(paths.userProfile.all),
    enabled: !!client.token,
  });

  const [filteredUsers, setFilteredUsers] = React.useState<UserProfileResponse[]>([]);

  if (isLoading) {
    return <>Loading...</>;
  }

  const handleOnSearchChange = _.debounce((value: string) => {
    if (!value) {
      setFilteredUsers([]);
      return;
    }

    if (data) {
      const filtered = data.filter((userProfile) => {
        const vals = value.split(" ").map((val) => val.toLowerCase());

        const name = userProfile.user.name.toLowerCase();
        const surname = userProfile.user.surname.toLowerCase();
        const username = userProfile.user.username.toLowerCase();

        return vals.every((val) => name.includes(val) || surname.includes(val) || username.includes(val));
      });

      setFilteredUsers(filtered);
    }
  }, 500);

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <div className="flex flex-row items-center gap-4 bg-base p-6 w-96 rounded-b-2xl">
          <SearchIcon className="w-8 h-8 text-white" />
          <SearchBar
            placeholder="Pretraži Korisnike..."
            onChange={(val) => handleOnSearchChange(val)}
            className="flex-grow"
          />
        </div>
      </div>

      {filteredUsers && <UserList users={filteredUsers} />}
    </div>
  );
}
