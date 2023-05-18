import React from "react";

import { Dialog } from "@headlessui/react";
import { LocationMarkerIcon } from "@heroicons/react/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik } from "formik";
import { Map } from "leaflet";
import * as Yup from "yup";

import paths from "../../api/paths";
import { CityResponse, FullLocationResponse } from "../../pages/Locations/types";
import Card from "../Card/Card";
import { useClient } from "../ClientProvider/ClientProvider";
import CreateLocationModalForm from "../CreateLocationModalForm/CreateLocationModalForm";
import FormWrapper, { parseError } from "../Formik/FormWrapper";

export type LocationRequest = Pick<FullLocationResponse, "type" | "name" | "cityName" | "lat" | "lng"> & {
  id: string | number | undefined;
  isCapitalCity: boolean;
  countryCode: string;
};

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required("Ime lokacije je obavezno").max(255, "Ime lokacije ne može biti duže od 255 znakova"),
  cityName: Yup.string().required("Ime grada je obavezno").max(255, "Ime grada ne može biti duže od 255 znakova"),
  lat: Yup.number().required("Latitude je obavezno").max(90).min(-90),
  lng: Yup.number().required("Longitude je obavezno").max(180).min(-180),
  type: Yup.string().required("Tip lokacije je obavezan"),
});

type LocationModalProps = {
  onClose?: () => void;
  cities?: CityResponse[];
  initialValues: LocationRequest;
  isEdit?: boolean;
  fetchCity?: boolean;
  map?: Map;
};

export default function LocationModal({
  onClose,
  cities,
  initialValues,
  isEdit,
  fetchCity = true,
  map,
}: LocationModalProps) {
  const { client } = useClient();
  const queryClient = useQueryClient();

  const { mutate: mutateCreate, isError: createError } = useMutation<void, string, LocationRequest>({
    mutationKey: ["createLocation"],
    mutationFn: async (newLocation: LocationRequest) => client.post(paths.locations.create, newLocation),
    onSuccess: () => {
      if (onClose) onClose();
      map?.closePopup();
      queryClient.refetchQueries(["locations"]);
    },
    onError: (error) => parseError(error),
  });

  const { mutate: mutateUpdate, isError: updateError } = useMutation<void, string, LocationRequest>({
    mutationKey: ["updateLocation"],
    mutationFn: async (newLocation: LocationRequest) => client.put(paths.locations.update(newLocation.id), newLocation),
    onSuccess: () => {
      if (onClose) onClose();
      map?.closePopup();
      queryClient.refetchQueries(["locations"]);
    },
    onError: (error) => parseError(error),
  });

  const handleOnClose = () => {
    if (onClose) onClose();
  };

  return (
    <Dialog open={true} onClose={handleOnClose} style={{ zIndex: 2200, position: "relative" }}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Card className="w-96 flex flex-col justify-center">
          <Dialog.Panel className="py-6 px-10">
            <Dialog.Title className="my-4 text-lg font-bold flex flex-row justify-center gap-2">
              <LocationMarkerIcon className="text-base w-6 h-6" />
              {isEdit ? "Uredi lokaciju" : "Dodaj novu lokaciju"}
            </Dialog.Title>
            <Formik
              onSubmit={(values) => {
                if (isEdit) mutateUpdate(values);
                else mutateCreate(values);
              }}
              initialValues={initialValues}
              validationSchema={ValidationSchema}
            >
              <FormWrapper isError={createError || updateError}>
                {cities && <CreateLocationModalForm onClose={handleOnClose} isEdit={isEdit} fetchCity={fetchCity} />}
              </FormWrapper>
            </Formik>
          </Dialog.Panel>
        </Card>
      </div>
    </Dialog>
  );
}
