import React from "react";

import { LocationMarkerIcon } from "@heroicons/react/solid";
import { useQuery } from "@tanstack/react-query";
import { Feature } from "geojson";

import { LocationCoordinatesResponse } from "../../api/location/types";
import paths from "../../api/paths";
import RecentBadges from "../../components/Badge/RecentBadges";
import { useClient } from "../../components/ClientProvider/ClientProvider";
import Map from "../../components/Map/Map";
import { getRandomColor } from "../../util/color";

export default function Home() {
  const { client } = useClient();

  const {
    data: visitedLocationsData,
    isLoading: locationsLoading,
    isError: locationsError,
  } = useQuery<LocationCoordinatesResponse[], string>({
    queryKey: ["visitedLocations"],
    queryFn: () => client.get(paths.locations.visited),
    enabled: !!client.token,
    retry: 0,
  });

  const {
    data: visitedCountriesData,
    isLoading: countriesLoading,
    isError: countriesError,
  } = useQuery<string[], string>({
    queryKey: ["visitedCountries"],
    queryFn: () => client.get(paths.countries.visited),
    enabled: !!client.token,
    retry: 0,
  });

  const {
    data: whitelistedCountriesData,
    isLoading: whitelistedCountriesLoading,
    isError: whitelistedCountriesError,
  } = useQuery<string[], string>({
    queryKey: ["whitelistedCountriesNotVisited"],
    queryFn: () => client.get(paths.countries.whitelisted.notVisited),
    enabled: !!client.token,
    retry: 0,
  });

  const [visitedCountries, setVisitedCountries] = React.useState<Feature[]>([]);
  const [whitelistedCountries, setWhitelistedCountries] = React.useState<Feature[]>([]);
  const [showMap, setShowMap] = React.useState<boolean>(false);

  const [color, setColor] = React.useState<string>(getRandomColor());
  const [showColor, setShowColor] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (countriesLoading || countriesError) return;

    const visitedCountries = visitedCountriesData.map((d) => JSON.parse(d.trim()));

    setVisitedCountries(visitedCountries);
    setShowMap(false);
  }, [visitedCountriesData, countriesLoading, countriesError]);

  React.useEffect(() => {
    if (whitelistedCountriesLoading || whitelistedCountriesError) return;

    const whitelistedCountries = whitelistedCountriesData.map((d) => JSON.parse(d.trim()));

    setWhitelistedCountries(whitelistedCountries);
    setShowMap(false);
  }, [whitelistedCountriesData, whitelistedCountriesLoading, whitelistedCountriesError]);

  React.useEffect(() => {
    if (!showMap) setShowMap(true);
  }, [showMap]);

  if (locationsLoading || countriesLoading || whitelistedCountriesLoading) return <div>Loading...</div>;
  if (locationsError || countriesError || whitelistedCountriesError) return <div>Error</div>;

  return (
    <div className="flex flex-col pb-4 h-full w-full">
      {showMap ? (
        <div className="h-4/5 flex flex-col flex-grow p-4 overflow-auto relative">
          <Map
            features={[
              {
                style: showColor ? { color, fillColor: color, fillOpacity: 0.5 } : { opacity: 0, fillOpacity: 0 },
                countries: visitedCountries,
              },
              {
                style: { color: "gray", fillColor: "gray", opacity: 0.2, fillOpacity: 0.3 },
                countries: whitelistedCountries,
              },
            ]}
            locations={visitedLocationsData}
            locationsContent={(location) => <div className="text-sm p-2">{location.name}</div>}
            dynamicMarkerContent={({ lat, lng }) => (
              <div className="flex flex-col justify-center items-center p-2">
                <div className="m-0">Koordinate</div>
                <div className="m-0">{`Širina: ${lat}`}</div>
                <div className="m-0">{`Dužina: ${lng}`}</div>
              </div>
            )}
            onZoom={(zoom) => (zoom >= 10 ? setShowColor(false) : setShowColor(true))}
            className="h-full flex-grow shadow-md rounded-t-2xl"
          />
          <div className="w-full h-16 z-10 flex flex-row">
            <div className="h-fit w-full p-4 bg-white rounded-b-2xl shadow-md flex flex-row gap-2 items-center">
              <div
                className="hidden md:flex h-8 w-8 rounded-full cursor-pointer flex-row gap-2 justify-center items-center select-none border-4 border-base-bg"
                onClick={() => setColor(getRandomColor())}
                style={{ backgroundColor: color }}
              ></div>
              <div className="flex-grow"></div>
              <div className="flex sm:flex-row flex-col gap-6">
                <div className="flex flex-row items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full flex flex-row items-center select-none"
                    style={{ backgroundColor: color }}
                  ></div>
                  <div>Posjećene države</div>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full flex flex-row items-center select-none"
                    style={{ backgroundColor: "gray" }}
                  ></div>
                  <div>Neposjećene države</div>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <LocationMarkerIcon className="text-blue-500 h-6 w-6" />
                  <div>Posjećene lokacije</div>
                </div>
              </div>
              <div className="flex-grow"></div>
              <div
                className="hidden md:flex h-8 w-8 rounded-full cursor-pointer flex-row gap-2 justify-center items-center select-none border-4 border-base-bg"
                onClick={() => setColor(getRandomColor())}
                style={{ backgroundColor: color }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-4/5 w-full">Loading map...</div>
      )}
      <RecentBadges className="mx-4 md:flex hidden" />
    </div>
  );
}
