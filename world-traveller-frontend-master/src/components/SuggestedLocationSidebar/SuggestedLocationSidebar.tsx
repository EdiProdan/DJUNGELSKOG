import React from "react";

import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/solid";
import { LatLng, Map } from "leaflet";
import _ from "lodash";

import { FullLocationResponse } from "../../pages/Locations/types";
import SearchBar from "../SearchBar/SearchBar";
import SuggestedLocationList from "./SuggestedLocationList";

type SuggestedLocationSidebarProps = {
  style?: React.CSSProperties;
  locations: FullLocationResponse[];
  latlng?: LatLng;
  setLatlng?: (latlng: LatLng | undefined) => void;
  map?: Map;
};

export default function SuggestedLocationSidebar({ style, locations, map }: SuggestedLocationSidebarProps) {
  const [filteredLocations, setFilteredLocations] = React.useState<FullLocationResponse[]>(locations);
  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  const [query, setQuery] = React.useState<string>("");

  const handleOnSearchChange = _.debounce((value: string) => {
    setQuery(value);
    if (locations) {
      const filtered = locations
        .filter((location) => location.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10);
      setFilteredLocations(filtered);
    }
  }, 500);

  React.useEffect(() => {
    if (query) {
      const filtered = locations
        .filter((location) => location.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10);
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(locations.slice(0, 10));
    }
  }, [locations, query]);

  return (
    <div
      style={style}
      className={`rounded-tl-2xl w-80 sm:w-96 absolute z-50 flex-grow bg-base top-0 sm:top-10 right-0 p-6 pl-8 flex flex-col gap-4 text-white min-h-[80%] ${
        collapsed ? "-right-80 sm:-right-96" : ""
      }`}
    >
      {collapsed ? (
        <div
          className="absolute w-12 h-32 pl-2 bg-base rounded-l-lg bottom-64 sm:bottom-0 -left-12 flex flex-row justify-center items-center cursor-pointer"
          onClick={() => setCollapsed(false)}
        >
          <ChevronDoubleLeftIcon className="w-8 h-8 text-white" />
        </div>
      ) : (
        <div
          className="absolute w-12 h-32 pl-2 bg-base rounded-l-lg bottom-64 sm:bottom-0 -left-12 flex flex-row justify-center items-center cursor-pointer"
          onClick={() => setCollapsed(true)}
        >
          <ChevronDoubleRightIcon className="w-8 h-8 text-white" />
        </div>
      )}
      <div className="flex items-center gap-4">
        <SearchBar
          placeholder="Pretraži lokacije..."
          onChange={(val) => handleOnSearchChange(val)}
          className="flex flex-grow"
        />
      </div>
      <div className="overflow-auto">
        {locations.length > 0 ? (
          <SuggestedLocationList locations={filteredLocations} map={map} />
        ) : (
          <div className="text-center mt-20">Nema predloženih lokacija.</div>
        )}
      </div>
    </div>
  );
}
