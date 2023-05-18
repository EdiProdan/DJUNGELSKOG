import React from "react";

import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { LocationTypes } from "../../api/location/types";
import paths from "../../api/paths";
import { TripCreateRequest, TransportationType, TrafficRating, TripRating } from "../../api/trips/types";
import Card from "../../components/Card/Card";
import { useClient } from "../../components/ClientProvider/ClientProvider";
import FormWrapper, { parseError } from "../../components/Formik/FormWrapper";
import AddTripForm from "./AddTripForm";
import AddTripImage from "./AddTripImage";

const ValidationSchema = Yup.object().shape({
  image: Yup.string().required("Slika je obavezna"),
  dateVisited: Yup.date().required(),
  transportationType: Yup.string().required(),
  trafficRating: Yup.string().required(),
  solo: Yup.boolean().required(),
  tripRating: Yup.string().required(),
  description: Yup.string().required("Opis putovanja je obavezan").max(1000, "Opis mora biti kraći od 1000 znakova"),
  locationIsSuggestion: Yup.boolean().required(),
  locationId: Yup.number(),
  locationSuggestion: Yup.object(),
});

export default function AddTrip() {
  const { client } = useClient();
  const navigate = useNavigate();

  const { mutate, isError } = useMutation<void, string, TripCreateRequest>({
    mutationKey: ["addNewTrip"],
    mutationFn: (values) => client.post(paths.trips.post, values),
    onSuccess: () => {
      navigate("/userProfile");
    },
    onError: (error) => parseError(error),
  });

  const initialValues = {
    image: "",
    dateVisited: moment().toISOString(),
    transportationType: TransportationType.CAR,
    trafficRating: TrafficRating.HIGH,
    solo: false,
    tripRating: TripRating.GOOD,
    description: "",
    locationIsSuggestion: false,
    locationId: -1,
    locationSuggestion: { name: "", lng: -1, lat: -1, type: LocationTypes.MUSEUM, cityName: "" },
  };

  return (
    <div className="flex justify-center lg:items-center h-full">
      <Card className="flex flex-row h-fit m-6 py-6 px-10">
        <Formik
          initialValues={initialValues}
          validationSchema={ValidationSchema}
          onSubmit={async (values) => {
            const img = await fetch(values.image)
              .then((image) => image.blob())
              .then((image) => image.arrayBuffer())
              .then((image) => Array.from(new Uint8Array(image)));

            mutate({ ...values, image: img });
          }}
        >
          <FormWrapper isError={isError}>
            <div className="flex flex-col md:flex-row items-center gap-10">
              <AddTripImage />
              <AddTripForm />
            </div>
          </FormWrapper>
        </Formik>
      </Card>
    </div>
  );
}
