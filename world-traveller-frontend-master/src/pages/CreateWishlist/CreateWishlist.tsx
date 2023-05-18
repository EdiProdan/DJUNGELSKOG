import React from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Formik } from "formik";
import { Map as LeafletMap } from "leaflet";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { WishlistEntryRequest } from "../../api/WishlistEntry/types";
import paths from "../../api/paths";
import Card from "../../components/Card/Card";
import { useClient } from "../../components/ClientProvider/ClientProvider";
import FormWrapper, { parseError } from "../../components/Formik/FormWrapper";
import Map from "../../components/Map/Map";
import { FullLocationResponse } from "../Locations/types";
import CreateWishlistForm from "./CreateWishlistForm";

const ValidationSchema = Yup.object().shape({
  locationId: Yup.number()
    .required()
    .test("is-positive", "Lokacija je obavezna", (value) => !!value && value > 0),
  visitBefore: Yup.date().required("Datum je obavezan"),
});

export default function CreateWishlist() {
  const { client } = useClient();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery<FullLocationResponse[], string>({
    queryKey: ["allLocations"],
    queryFn: () => client.get(paths.locations.approved),
    enabled: !!client.token,
  });

  const { mutate, isError: mutationError } = useMutation<void, string, WishlistEntryRequest>({
    mutationKey: ["createWishlistEntry"],
    mutationFn: (values) => client.post(paths.wishlistEntry.post, values),
    onSuccess: () => {
      navigate("/wishlist");
    },
    onError: (error) => parseError(error),
  });

  const initialValues: WishlistEntryRequest = {
    locationId: -1,
    visitBefore: moment().toISOString(),
  };

  const [map, setMap] = React.useState<LeafletMap>();

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error</>;

  return (
    <Card className="flex-col lg:m-20 m-4 mx bg-gray h-[720px] overflow-hidden">
      <Map
        className="w-full h-4/6 bg-black"
        features={[]}
        locations={data}
        onMount={setMap}
        dynamicMarkerContent={({ lat, lng }) => (
          <div className="flex flex-col justify-center items-center p-2">
            <div className="m-0">Koordinate</div>
            <div className="m-0">{`Širina: ${lat}`}</div>
            <div className="m-0">{`Dužina: ${lng}`}</div>
          </div>
        )}
      />
      <Formik onSubmit={(values) => mutate(values)} initialValues={initialValues} validationSchema={ValidationSchema}>
        <FormWrapper isError={mutationError}>
          <CreateWishlistForm map={map} locations={data} />
        </FormWrapper>
      </Formik>
    </Card>
  );
}
