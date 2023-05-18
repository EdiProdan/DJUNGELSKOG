import React from "react";

import { SearchIcon } from "@heroicons/react/outline";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

import { useCurrentUser } from "../../Router";
import { BadgeResponse } from "../../api/badge/types";
import paths from "../../api/paths";
import ActionButton from "../../components/ActionButton/ActionButton";
import BadgesGrid from "../../components/Badge/BadgesGrid";
import { useClient } from "../../components/ClientProvider/ClientProvider";
import SearchBar from "../../components/SearchBar/SearchBar";

export default function ManageBadges() {
  const navigate = useNavigate();
  const { client } = useClient();
  const currentUser = useCurrentUser();

  const [filteredBadges, setFilteredBadges] = React.useState<BadgeResponse[]>([]);

  const { data, isLoading, isError } = useQuery<BadgeResponse[], string>({
    queryKey: ["allBadges"],
    queryFn: () => client.get(paths.badges.all),
    enabled: !!client.token,
  });

  //show correct at beggining when filteredBadges is empty
  React.useEffect(() => {
    if (data) {
      const filtered = data;
      setFilteredBadges(filtered);
    }
  }, [data]);

  const handleOnSearchChange = _.debounce((value: string) => {
    if (data) {
      const filtered = data.filter((badge) => badge.name.toLowerCase().includes(value.toLowerCase()));
      setFilteredBadges(filtered);
    }
  }, 500);

  if (isLoading) {
    return <>Loading...</>;
  }

  if (isError) {
    return <>Error</>;
  }

  if (currentUser.roles.includes("ADMIN") || currentUser.roles.includes("CARTOGRAPHER")) {
    return (
      <div className="flex flex-col">
        <div className="flex justify-center mb-10">
          <div className="flex flex-row items-center gap-4 bg-base p-6 w-96 rounded-b-2xl">
            <SearchIcon className="w-8 h-8 text-white" />
            <SearchBar
              placeholder="Pretraži bedževe..."
              onChange={(val) => handleOnSearchChange(val)}
              className="flex-grow"
            />
          </div>
        </div>
        <div className="">
          <BadgesGrid badges={filteredBadges} />
        </div>
        <div className="absolute bottom-10 sm:bottom-32 lg:bottom-10 right-10">
          <ActionButton className="mt-10" text="Novi Bedž" onClick={() => navigate("/badges/create")} />
        </div>
      </div>
    );
  } else {
    return <>You are not authorized to view this page</>;
  }
}
