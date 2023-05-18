import React from "react";

import { LocationMarkerIcon, PencilAltIcon } from "@heroicons/react/outline";
import { Map } from "leaflet";

import { FullLocationResponse } from "../../pages/Locations/types";

export default function LocationItem({
  location,
  setEditData,
  map,
}: {
  location: FullLocationResponse;
  setEditData?: React.Dispatch<React.SetStateAction<FullLocationResponse | undefined>>;
  map?: Map;
}) {
  const handleOnEditClick = React.useCallback(() => {
    if (setEditData) setEditData(location);
  }, [location, setEditData]);

  return (
    <div className="flex flex-row h-12 items-center gap-2 w-full pr-2">
      <div
        className="flex flex-grow items-center gap-2 cursor-pointer transition-all duration-150 focus:shadow-outline hover:text-slate-400 hover:pl-1"
        onClick={() => map?.flyTo({ lat: location.lat, lng: location.lng }, 11)}
      >
        <LocationMarkerIcon className="w-5" />
        <div className="text-lg truncate">{location.name}</div>
      </div>
      <PencilAltIcon
        className="w-8 h-8 transition-colors duration-150 focus:shadow-outline hover:text-slate-400 cursor-pointer"
        onClick={handleOnEditClick}
      />
    </div>
  );
}
