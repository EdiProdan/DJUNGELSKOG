import React from "react";

import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, PlusCircleIcon } from "@heroicons/react/outline";
import { useQuery } from "@tanstack/react-query";
import { LatLng, Map } from "leaflet";
import _ from "lodash";

import { LocationTypes } from "../../api/location/types";
import paths from "../../api/paths";
import { CityResponse, FullLocationResponse } from "../../pages/Locations/types";
import { useClient } from "../ClientProvider/ClientProvider";
import LocationList from "../LocationList/LocationList";
import LocationModal, { LocationRequest } from "../LocationModal/LocationModal";
import { reverseGetCountryAndCity } from "../Map/Map";
import SearchBar from "../SearchBar/SearchBar";

type LocationSidebarProps = {
  style?: React.CSSProperties;
  locations: FullLocationResponse[];
  latlng?: LatLng;
  setLatlng?: (latlng: LatLng | undefined) => void;
  map?: Map;
};

export default function LocationSidebar({ style, locations, latlng, setLatlng, map }: LocationSidebarProps) {
  const { client } = useClient();

  const [filteredLocations, setFilteredLocations] = React.useState<FullLocationResponse[]>(locations);
  const [collapsed, setCollapsed] = React.useState<boolean>(false);

  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [editLocation, setEditLocation] = React.useState<FullLocationResponse | undefined>();
  const [initialValues, setInitialValues] = React.useState<LocationRequest>();

  const [query, setQuery] = React.useState<string>("");

  const { data: cities } = useQuery<CityResponse[], string>({
    queryKey: ["cities"],
    queryFn: () => client.get(paths.locations.cities.get),
    enabled: !!client.token,
  });

  React.useEffect(() => {
    if (latlng) {
      reverseGetCountryAndCity(client, latlng).then((data) => {
        setInitialValues({
          id: undefined,
          name: data.name,
          lat: latlng.lat,
          lng: latlng.lng,
          cityName: data.cityName,
          type: LocationTypes.OTHER,
          isCapitalCity: false,
          countryCode: data.countryISO3,
        });
        setShowModal(true);
      });
    }
  }, [latlng, client]);

  React.useEffect(() => {
    if (query) {
      const filtered = locations.filter((badge) => badge.name.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(locations.slice(0, 10));
    }
  }, [locations, query]);

  const handleOnSearchChange = _.debounce((value: string) => {
    setQuery(value);
    if (locations) {
      const filtered = locations.filter((badge) => badge.name.toLowerCase().includes(value.toLowerCase())).slice(0, 10);
      setFilteredLocations(filtered);
    }
  }, 500);

  React.useEffect(() => {
    if (editLocation) {
      setInitialValues({
        id: editLocation.id,
        name: editLocation.name,
        lat: editLocation.lat,
        lng: editLocation.lng,
        cityName: editLocation.cityName,
        type: editLocation.type as LocationTypes,
        isCapitalCity: editLocation.isCapitalCity,
        countryCode: editLocation.countryCode,
      });
      setShowModal(false);
    }
  }, [editLocation]);

  return (
    <div
      style={style}
      className={`rounded-tl-2xl w-80 sm:w-96 absolute z-50 flex-grow bg-base top-0 sm:top-10 right-0 p-6 pl-8 flex flex-col gap-4 text-white min-h-[80%] ${
        collapsed ? "-right-80 sm:-right-96" : ""
      }`}
    >
      {collapsed ? (
        <div
          className="absolute w-12 h-32 pl-2 bg-base rounded-l-lg bottom-0 -left-12 flex flex-row justify-center items-center cursor-pointer"
          onClick={() => setCollapsed(false)}
        >
          <ChevronDoubleLeftIcon className="w-8 h-8 text-white" />
        </div>
      ) : (
        <div
          className="absolute w-12 h-32 pl-2 bg-base rounded-l-lg bottom-0 -left-12 flex flex-row justify-center items-center cursor-pointer"
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
        <PlusCircleIcon
          className="inline-flex items-center justify-center w-11 h-11 transition-colors duration-100 rounded-full focus:shadow-outline hover:text-slate-400 cursor-pointer"
          onClick={() => {
            setShowModal(true);
            setEditLocation(undefined);
          }}
        />
      </div>
      <LocationList locations={filteredLocations} setEditData={setEditLocation} map={map} />
      {editLocation && initialValues && (
        <LocationModal
          cities={cities}
          onClose={() => {
            setShowModal(false);
            setInitialValues(undefined);
            setLatlng?.(undefined);
            setEditLocation(undefined);
          }}
          initialValues={initialValues}
          isEdit={true}
          map={map}
        />
      )}
      {showModal && (
        <LocationModal
          cities={cities}
          onClose={() => {
            setShowModal(false);
            setInitialValues(undefined);
            setLatlng?.(undefined);
          }}
          fetchCity={!!initialValues}
          initialValues={
            initialValues || {
              id: undefined,
              name: "",
              lat: 0,
              lng: 0,
              cityName: "",
              type: LocationTypes.MUSEUM,
              isCapitalCity: false,
              countryCode: "",
            }
          }
          map={map}
        />
      )}
    </div>
  );
}
