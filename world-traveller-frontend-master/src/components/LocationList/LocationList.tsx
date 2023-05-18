import React from "react";

import { Map } from "leaflet";

import { FullLocationResponse } from "../../pages/Locations/types";
import LocationItem from "../LocationItem/LocationItem";

export default function LocationList({
  locations,
  setEditData,
  map,
}: {
  locations: FullLocationResponse[];
  setEditData?: React.Dispatch<React.SetStateAction<FullLocationResponse | undefined>>;
  map?: Map;
}) {
  return (
    <div className="flex flex-col gap-2">
      {locations.map((location) => (
        <LocationItem key={location.id} location={location} setEditData={setEditData} map={map} />
      ))}
    </div>
  );
}
