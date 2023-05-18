import React from "react";

import { LocationMarkerIcon } from "@heroicons/react/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Map } from "leaflet";

import { LocationTypes } from "../../api/location/types";
import paths from "../../api/paths";
import { FullLocationResponse } from "../../pages/Locations/types";
import ActionButton from "../ActionButton/ActionButton";
import { useClient } from "../ClientProvider/ClientProvider";
import { parseError } from "../Formik/FormWrapper";
import { LocationRequest } from "../LocationModal/LocationModal";
import { reverseGetCountryAndCity } from "../Map/Map";

export type SuggestedLocationItemProps = {
  location: FullLocationResponse;
  map?: Map;
};

export default function SuggestedLocationItem({ location, map }: SuggestedLocationItemProps) {
  const { client } = useClient();
  const queryClient = useQueryClient();

  const [lat, lng] = [location.lat, location.lng];

  const [fetchingLocation, setFetchingLocation] = React.useState(false);
  const [countryCity, setCountryCity] = React.useState<{ cityName: string; name: string; countryISO3: string }>();

  const { mutate: approveMutation } = useMutation<void, string, LocationRequest>({
    mutationKey: ["locations", location.id],
    mutationFn: (values) => client.put(paths.locations.update(location.id), values),
    onSuccess: () => queryClient.refetchQueries(["suggestedLocations"]),
    onError: (error) => parseError(error),
  });

  const { mutate: rejectMutation } = useMutation<void, string, void>({
    mutationKey: ["locations", location.id],
    mutationFn: () => client.delete(paths.locations.delete(location.id)),
    onSuccess: () => queryClient.refetchQueries(["suggestedLocations"]),
    onError: (error) => parseError(error),
  });

  React.useEffect(() => {
    if (fetchingLocation) {
      reverseGetCountryAndCity(client, { lng, lat }).then((data) => {
        setFetchingLocation(false);
        setCountryCity(data);
      });
    }
  }, [fetchingLocation, client, lat, lng]);

  React.useEffect(() => {
    if (countryCity) {
      approveMutation({
        id: location.id,
        name: location.name,
        lat,
        lng,
        type: location.type,
        countryCode: countryCity.countryISO3,
        cityName: countryCity.cityName,
        isCapitalCity: false,
      });
    }
  }, [countryCity, lat, lng, location.id, location.name, location.type, approveMutation]);

  const getLocationType = (type: LocationTypes) => {
    switch (type) {
      case LocationTypes.MUSEUM:
        return "Muzej";
      case LocationTypes.CHURCH:
        return "Crkva";
      case LocationTypes.STADIUM:
        return "Stadion";
      case LocationTypes.OTHER:
        return "Ostalo";
    }
  };

  return (
    <div className="items-center gap-2 my-4">
      <div className="flex flex-row h-12 items-center gap-2 w-full pr-2">
        <div
          className="font-bold flex flex-grow items-center gap-2 cursor-pointer transition-all duration-150 focus:shadow-outline hover:text-slate-400 hover:pl-1"
          onClick={() => map?.flyTo({ lat: location.lat, lng: location.lng }, 11)}
        >
          <LocationMarkerIcon className="w-5" />
          <div className="text-lg truncate">{location.name}</div>
        </div>
      </div>
      <div className="self-center w-72 truncate ml-2">Preporučio: @{location.suggestedBy}</div>
      <div className="self-center w-72 truncate ml-2">Koorinate:</div>
      <div className="self-center w-72 truncate ml-4">Širina: {location.lat}</div>
      <div className="self-center w-72 truncate ml-4">dužina: {location.lng}</div>
      <div className="self-center w-72 truncate ml-2">Tip lokacije: {getLocationType(location.type)}</div>
      <div className="flex mt-4">
        <ActionButton
          className="mx-auto text-center bg-red-500 hover:opacity-80"
          text={"Odbaci"}
          type="button"
          onClick={() => {
            rejectMutation();
          }}
        />
        <ActionButton
          className="mx-auto text-center bg-teal-500 hover:opacity-80"
          text={"Prihvati"}
          type="button"
          onClick={async () => {
            setFetchingLocation(true);
          }}
          isDisabled={fetchingLocation}
        />
      </div>
    </div>
  );
}
