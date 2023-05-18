import React from "react";

import { useQuery } from "@tanstack/react-query";
import { Form, useFormikContext } from "formik";
import { useNavigate } from "react-router-dom";

import { FullLocationResponse } from "../../api/location/types";
import paths from "../../api/paths";
import { TripCreateRequest } from "../../api/trips/types";
import { useClient } from "../../components/ClientProvider/ClientProvider";
import DatePicker from "../../components/Formik/DatePicker";
import FormikAutocompleteField from "../../components/Formik/FormikAutocompleteField";
import Select from "../../components/Formik/Select";
import SwitchComponent from "../../components/Formik/SwitchComponent";
import TextInput from "../../components/Formik/TextInput";
import MapModal from "../../components/Map/MapModal";
import FormButtonTrip from "./FormButtonTrip";

export default function AddTripForm() {
  const { client } = useClient();
  const navigate = useNavigate();
  const { errors, touched, handleSubmit, isSubmitting, setFieldValue, values } = useFormikContext<TripCreateRequest>();
  const [selectedItem, setSelectedItem] = React.useState<FullLocationResponse>({
    id: -1,
    name: "",
    lng: -1,
    lat: -1,
    cityId: -1,
    cityName: "",
    countryCode: "",
    countryName: "",
  });
  const {
    data: approvedLocations,
    isLoading: approvedLocationsLoading,
    isError: approvedLocationsError,
  } = useQuery<FullLocationResponse[], string>({
    queryKey: ["approvedLocations"],
    queryFn: () => client.get(paths.locations.approved),
    enabled: !!client.token,
  });

  return (
    <Form className="flex flex-col gap-4">
      <TextInput name="description" label="Opis putovanja:" type="text" errors={errors} touched={touched} />

      <div className="flex flex-row gap-2 items-center">
        <div className="m-auto mr-auto">{values.locationIsSuggestion ? "Predložena lokacija" : "Lokacija:"}</div>

        <MapModal locations={approvedLocations || []} setSelectedItem={setSelectedItem} setFieldValue={setFieldValue} />

        {!approvedLocationsLoading && !approvedLocationsError && !values.locationIsSuggestion ? (
          <FormikAutocompleteField
            name="locationId"
            data={approvedLocations || []}
            filterBy="name"
            id="id"
            value={selectedItem}
            onChange={setSelectedItem}
            errors={errors}
            touched={touched}
          />
        ) : (
          <TextInput name="locationSuggestion.name" type="text" errors={errors} touched={touched} disabled />
        )}
      </div>
      <div className="flex flex-row">
        <p className="my-auto mr-4">Datum: </p>
        <div className="ml-auto">
          <DatePicker
            selected={new Date()}
            dateFormat="dd.MM.yyyy"
            className="form-control"
            name="dateVisited"
            onChange={(date) => setFieldValue("dateVisited", date && date.toISOString())}
          />
        </div>
      </div>
      <div className="flex flex-row">
        <div className="my-auto mr-auto">Tip prijevoza: </div>
        <Select
          list={["CAR", "TRAIN", "PLANE", "BOAT", "HELICOPTER", "ON_FOOT", "OTHER"]}
          displayValues={["Automobil", "Vlak", "Avion", "Brod", "Helikopter", "Pješice", "Ostalo"]}
          name={"transportationType"}
          className="w-1/2"
        />
      </div>
      <div className="flex flex-row">
        <div className="my-auto mr-auto">Ocjena putovanja: </div>
        <Select
          list={["FUN", "OK", "GOOD", "VERY_GOOD", "EXCELLENT"]}
          displayValues={["Zabavno", "U redu", "Dobro", "Vrlo dobro", "Odlično"]}
          name={"tripRating"}
          className="w-1/2"
        />
      </div>
      <div className="flex flex-row">
        <div className="my-auto mr-auto">Ocjena prometa: </div>
        <Select
          list={["LOW", "MEDIUM", "HIGH", "VERY_HIGH", "EXTREMELY_HIGH"]}
          displayValues={["Niska", "Srednja", "Visoka", "Vrlo visoka", "Izuzetno visoka"]}
          name={"trafficRating"}
          className="w-1/2"
        />
      </div>

      {values.locationIsSuggestion && (
        <div className="flex flex-row">
          <div className="my-auto mr-auto">Tip lokacije: </div>
          <Select
            list={["MUSEUM", "STADIUM", "CHURCH", "OTHER"]}
            displayValues={["Muzej", "Stadion", "Crkva", "Ostalo"]}
            name={"locationSuggestion.type"}
            className="w-1/2"
          />
        </div>
      )}

      <div className="flex flex-row">
        <label className="mr-5">Putovao/la samostalno: </label>
        <div className="m-auto">
          <SwitchComponent name="solo" />
        </div>
      </div>
      <div className="flex flex-row">
        <FormButtonTrip
          text="Odbaci"
          className="w-1/3 mr-5 bg-[#FF708B] mx-auto"
          onClick={() => navigate("/")}
          isDisabled={isSubmitting}
        />
        <FormButtonTrip
          text="Spremi"
          className="w-1/3 ml-5 bg-[#383874]"
          onClick={() => handleSubmit()}
          isDisabled={isSubmitting}
        />
      </div>
    </Form>
  );
}
