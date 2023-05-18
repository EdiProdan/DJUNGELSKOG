import React from "react";

import { useQuery } from "@tanstack/react-query";

import { BadgeResponse } from "../../api/badge/types";
import paths from "../../api/paths";
import BadgesGrid from "../../components/Badge/BadgesGrid";
import { useClient } from "../../components/ClientProvider/ClientProvider";

export default function Badges() {
  const { client } = useClient();

  const { data, isLoading, isError } = useQuery<BadgeResponse[], string>({
    queryKey: ["wonBadges"],
    queryFn: () => client.get(paths.badges.won),
    enabled: !!client.token,
    refetchOnWindowFocus: false,
  });

  const {
    data: notWon,
    isLoading: load,
    isError: err,
  } = useQuery<BadgeResponse[], string>({
    queryKey: ["notWonBadges"],
    queryFn: () => client.get(paths.badges.notWon),
    enabled: !!client.token,
    refetchOnWindowFocus: false,
  });

  if (isLoading || load) {
    return <>Loading...</>;
  }

  if (isError || err) {
    return <>Error</>;
  }

  return (
    <div className="flex-col">
      <div className="mt-10">
        <div className="flex-col">
          <h1 className="lg:ml-20 text-3xl text-center lg:text-left">Osvojeni</h1>
          <div className="mt-5">
            {data.length === 0 && (
              <p className="font-bold text-xl flex justify-center mt-10">Nema osvojenih bedževa!</p>
            )}
            <BadgesGrid badges={data} />
          </div>
        </div>
      </div>
      <div className="mt-20">
        <div>
          <h1 className="lg:ml-20 text-3xl text-center lg:text-left">Neosvojeni</h1>
          <div className="mt-5">
            {notWon.length === 0 && (
              <p className="font-bold text-xl flex justify-center mt-10">Nema neosvojenih bedževa!</p>
            )}
            <BadgesGrid badges={notWon} />
          </div>
        </div>
      </div>
    </div>
  );
}
