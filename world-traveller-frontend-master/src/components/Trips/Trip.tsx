import React from "react";

import { HeartIcon } from "@heroicons/react/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import paths from "../../api/paths";
import { TrafficRating, TripResponse } from "../../api/trips/types";
import Card from "../Card/Card";
import { useClient } from "../ClientProvider/ClientProvider";
import ImageWrapper from "../Image/ImageWrapper";

type TripProps = {
  trip: TripResponse;
  isProfile?: boolean;
};

export default function Trip({ trip, isProfile = false }: TripProps) {
  const { id } = useParams();
  const { client } = useClient();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: like } = useMutation({
    mutationKey: ["likeTrip", trip.id],
    mutationFn: () => client.post(paths.trips.like(trip.id)),
    onSuccess: () => {
      if (isProfile) queryClient.invalidateQueries(["recentTrips", id]);
      else queryClient.invalidateQueries(["socialTrips"]);
    },
  });

  const { mutate: unlike } = useMutation({
    mutationKey: ["unlikeTrip", trip.id],
    mutationFn: () => client.post(paths.trips.unlike(trip.id)),
    onSuccess: () => {
      if (isProfile) queryClient.invalidateQueries(["recentTrips", id]);
      else queryClient.invalidateQueries(["socialTrips"]);
    },
  });

  const [liked, setLiked] = React.useState(trip.isLiked);

  const getTrafficRating = (rating: TrafficRating) => {
    switch (rating) {
      case TrafficRating.LOW:
        return "Niska";
      case TrafficRating.MEDIUM:
        return "Srednja";
      case TrafficRating.HIGH:
        return "Visoka";
      case TrafficRating.VERY_HIGH:
        return "Jako visoka";
      case TrafficRating.EXTREMELY_HIGH:
        return "Iznimno visoka";
    }
  };

  return (
    <Card className="sm:w-2/3 lg:w-3/5 m-4 py-4">
      <p className="pl-4 pb-2">
        <span
          className="font-bold hover:opacity-70 cursor-pointer"
          onClick={() => navigate(`/userProfile/${trip.userId}`)}
        >
          {trip.username}
        </span>{" "}
        je na lokaciji {trip.location.name}
      </p>

      <div>
        <ImageWrapper alt="" base64Encoded={true} imageURL={trip.image} className="border-y border-gray-300" />
        <div className="relative bottom-0 flex flex-row gap-4 p-2 justify-center">
          <div className="flex flex-row items-center gap-2 text-sm">
            Tip prijevoza:
            <p className="text-white bg-emerald-500 py-2 px-4 rounded-full">{trip.transportationType}</p>
          </div>
          <div className="flex flex-row items-center gap-2 text-sm">
            Ocjena prometa:
            <p className="text-white bg-indigo-500 py-2 px-4 rounded-full text-sm">
              {getTrafficRating(trip.trafficRating)}
            </p>
          </div>
          <p className="text-white bg-red-500 py-2 px-4 rounded-full text-sm">{trip.solo ? "Solo" : "U društvu"}</p>
        </div>
      </div>
      <div className="flex flex-row justify-between pl-2">
        <div className="flex flex-row gap-4 p-2">
          <HeartIcon
            className={`h-6 w-6 ${liked ? "text-red-500" : "text-black"}`}
            onClick={() => {
              if (!liked) {
                like();
                setLiked(true);
              } else {
                unlike();
                setLiked(false);
              }
            }}
          />
          <p className="text-md mt-auto mb-auto">{trip.numLikes} lajk/ova</p>
        </div>
        <p className="p-2 pr-4 mt-auto mb-auto">{`${trip.dateVisited[2]}.${trip.dateVisited[1]}.${trip.dateVisited[0]}`}</p>
      </div>
      <p className="p-2 pl-4">
        <span
          className="font-bold hover:opacity-70 cursor-pointer"
          onClick={() => navigate(`/userProfile/${trip.userId}`)}
        >
          {trip.username}
        </span>{" "}
        {trip.description}
      </p>
    </Card>
  );
}
