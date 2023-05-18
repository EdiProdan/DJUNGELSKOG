import React from "react";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { useCurrentUser } from "../../Router";
import paths from "../../api/paths";
import { TripResponse } from "../../api/trips/types";
import { BasicPageRequest } from "../Badge/types";
import { useClient } from "../ClientProvider/ClientProvider";
import Trip from "./Trip";

export default function ProfileTrips() {
  const { id } = useParams();
  const { client } = useClient();
  const currentUser = useCurrentUser();

  const { data: recentTrips } = useQuery<TripResponse[], string>({
    queryKey: ["recentTrips", id, currentUser.id],
    queryFn: () => client.post(paths.trips.recent(id ? id : currentUser.id), { page: 0, size: 10 } as BasicPageRequest),
    enabled: !!client.token,
  });

  return (
    <>
      {recentTrips?.map((trip) => (
        <Trip key={trip.id} trip={trip} isProfile={true} />
      ))}
    </>
  );
}
