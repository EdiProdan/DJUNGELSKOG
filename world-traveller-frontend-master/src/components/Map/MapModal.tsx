import React, { useState } from "react";

import { Dialog } from "@headlessui/react";
import { LocationMarkerIcon } from "@heroicons/react/outline";

import { LocationCoordinatesResponse, LocationTypes } from "../../api/location/types";
import ActionButton from "../ActionButton/ActionButton";
import { useClient } from "../ClientProvider/ClientProvider";
import Map, { reverseGetCountryAndCity } from "./Map";

type MapModalProps = {
  locations: LocationCoordinatesResponse[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelectedItem: (value: any, shouldValidate?: boolean | undefined) => void;
};
export default function MapModal({ locations, setFieldValue, setSelectedItem }: MapModalProps) {
  const { client } = useClient();

  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  return (
    <>
      <div className="ml-5">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-base px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          <LocationMarkerIcon className="h-6" />
        </button>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex flex-col gap-4 items-center justify-center p-4 h-full w-full">
          <Map
            className="h-full w-full rounded-2xl"
            features={[]}
            locations={locations}
            dynamicMarkerContent={({ lat, lng }) => (
              <div className="flex flex-col gap-2">
                <div className="text-center">{`lat: ${lat}`}</div>
                <div className="text-center">{`lng: ${lng}`}</div>
                <ActionButton
                  text="Predloži lokaciju"
                  onClick={async () => {
                    setFieldValue("locationIsSuggestion", true);
                    setFieldValue("locationId", -1);
                    const { cityName, name } = await reverseGetCountryAndCity(client, { lat, lng });
                    setFieldValue("locationSuggestion", { name, lat, lng, type: "MUSEUM", cityName });
                    setIsOpen(false);
                  }}
                  className="bg-base"
                />
              </div>
            )}
            locationsContent={(location) => (
              <div className="flex flex-col gap-2">
                <div className="text-center">{location.name}</div>
                <ActionButton
                  text="Odaberi lokaciju"
                  onClick={() => {
                    setSelectedItem(location);
                    setFieldValue("locationIsSuggestion", false);
                    setFieldValue("locationId", location.id);
                    setFieldValue("locationSuggestion", {
                      name: "",
                      lng: -1,
                      lat: -1,
                      type: LocationTypes.MUSEUM,
                      cityName: "",
                    });
                    setIsOpen(false);
                  }}
                  className="bg-emerald-500"
                />
              </div>
            )}
          />
          <ActionButton text="Zatvori" onClick={closeModal} className="bg-red-400" />
        </div>
      </Dialog>
    </>
  );
}
