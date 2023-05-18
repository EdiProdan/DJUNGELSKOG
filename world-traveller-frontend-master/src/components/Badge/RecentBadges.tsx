import React from "react";

import { ChevronDoubleRightIcon } from "@heroicons/react/outline";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { useCurrentUser } from "../../Router";
import { BadgeResponse } from "../../api/badge/types";
import paths from "../../api/paths";
import Card from "../Card/Card";
import { useClient } from "../ClientProvider/ClientProvider";
import ShortCard from "./ShortCard";
import { BasicPageRequest } from "./types";

type RecentBadgesProps = {
  className?: string;
};

export default function RecentBadges({ className }: RecentBadgesProps) {
  const navigate = useNavigate();
  const { client } = useClient();
  const currentUser = useCurrentUser();
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery<BadgeResponse[], string>({
    queryKey: ["recentBadges"],
    queryFn: () => client.post(paths.badges.recent(), { page: 0, size: 5 } as BasicPageRequest),
    enabled: !!client.token,
  });

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error</>;

  return (
    <Card className={`p-4 flex flex-col gap-4 ${className}`}>
      <div className="flex flex-row w-full">
        <h2 className="font-bold text-xl flex-grow">Nedavni bedževi</h2>
        {data.length > 5 && (currentUser.id === Number(id) || !id) && (
          <div
            className="flex flex-row items-center gap-2 cursor-pointer text-base pr-3"
            onClick={() => navigate("/badges")}
          >
            <ChevronDoubleRightIcon className="w-4 h-4" />
            <span className="text-sm">Prikaži sve</span>
          </div>
        )}
      </div>
      {data.length === 0 && <p className="text-center">Korisnik nema bedževa!</p>}
      <div className="grid grid-cols-5 gap-4">
        {data.slice(0, 5).map((badge) => (
          <ShortCard key={badge.id} badge={badge} />
        ))}
      </div>
    </Card>
  );
}
