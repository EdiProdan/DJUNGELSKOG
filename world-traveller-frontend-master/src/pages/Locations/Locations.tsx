import React from "react";

import { useQuery } from "@tanstack/react-query";
import { LatLng, Map as LeafletMap } from "leaflet";

import paths from "../../api/paths";
import ActionButton from "../../components/ActionButton/ActionButton";
import { useClient } from "../../components/ClientProvider/ClientProvider";
import LocationSidebar from "../../components/LocationSidebar/LocationSidebar";
import Map from "../../components/Map/Map";
import { FullLocationResponse } from "./types";

export default function Locations() {
  const { client } = useClient();
  const { data, isLoading, isError } = useQuery<FullLocationResponse[], string>({
    queryKey: ["locations"],
    queryFn: () => client.get(paths.locations.approved),
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
        dynamicMarkerContent={(ll) => (
          <div className="flex flex-col gap-2">
            <div className="m-0">Koordinate</div>
            <div className="text-center">{`Širina: ${ll.lat}`}</div>
            <div className="text-center">{`Dužina: ${ll.lng}`}</div>
            <ActionButton text="Dodaj kao novu lokaciju" onClick={() => setLatlng(ll)} isDisabled={!!latlng} />
          </div>
        )}
        onMount={setMap}
      />
      <LocationSidebar locations={data || []} latlng={latlng} setLatlng={setLatlng} map={map} />
    </div>
  );
}
