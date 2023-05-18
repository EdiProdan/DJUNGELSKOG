import React from "react";

import { useQuery } from "@tanstack/react-query";

import paths from "../../api/paths";
import { TripResponse } from "../../api/trips/types";
import { useClient } from "../../components/ClientProvider/ClientProvider";
import Trip from "../../components/Trips/Trip";

export default function Profile() {
  const { client } = useClient();

  const {
    data: socialTrips,
    isLoading,
    isError,
  } = useQuery<TripResponse[], string>({
    queryKey: ["socialTrips"],
    queryFn: () => client.get(paths.trips.social),
    enabled: !!client.token,
  });

  if (isLoading) return <span>Loading...</span>;
  if (isError) return <span>Error</span>;

  return socialTrips.length > 0 ? (
    <div className="mt-8">
      <div className="w-full flex flex-col justify-center items-center gap-4">
        {socialTrips.map((trip) => (
          <Trip key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  ) : (
    <div className="w-full h-full flex flex-col justify-center text-center">
      Vaši mreža ljudi nema objavljenih putovanja
    </div>
  );
}
