import React from "react";

import { Map } from "leaflet";

import { FullLocationResponse } from "../../pages/Locations/types";
import SuggestedLocationItem from "./SuggestedLocationItem";

export type SuggestedLocationListProps = {
  locations: FullLocationResponse[];
  map?: Map;
};

export default function SuggestedLocationList({ locations, map }: SuggestedLocationListProps) {
  return (
    <div className="flex flex-col">
      {locations.map((location, index) => (
        <React.Fragment key={location.id}>
          <SuggestedLocationItem location={location} map={map} />
          {index !== locations.length - 1 && <hr />}
        </React.Fragment>
      ))}
    </div>
  );
}
