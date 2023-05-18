import React from "react";

import { useQuery } from "@tanstack/react-query";
import { LatLng, Map as LeafletMap } from "leaflet";

import paths from "../../api/paths";
import { useClient } from "../../components/ClientProvider/ClientProvider";
import Map from "../../components/Map/Map";
import SuggestedLocationSidebar from "../../components/SuggestedLocationSidebar/SuggestedLocationSidebar";
import { FullLocationResponse } from "../Locations/types";

export default function LocationSuggestions() {
  const { client } = useClient();
  const { data, isLoading, isError } = useQuery<FullLocationResponse[], string>({
    queryKey: ["suggestedLocations"],
    queryFn: () => client.get(paths.locations.suggestions),
    enabled: !!client.token,
  });

  const [latlng, setLatlng] = React.useState<LatLng>();
  const [map, setMap] = React.useState<LeafletMap>();

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error</>;

  return (
    <div className="h-full w-full flex flex-row relative overflow-hidden">
      <Map
        features={[]}
        locations={data}
        className="h-full w-full z-10 flex-grow"
        onMount={setMap}
        dynamicMarkerContent={(ll) => (
          <div className="flex flex-col gap-2">
            <div className="m-0">Koordinate</div>
            <div className="text-center">{`Širina: ${ll.lat}`}</div>
            <div className="text-center">{`Dužina: ${ll.lng}`}</div>
          </div>
        )}
      />
      <SuggestedLocationSidebar locations={data} latlng={latlng} setLatlng={setLatlng} map={map} />
    </div>
  );
}
