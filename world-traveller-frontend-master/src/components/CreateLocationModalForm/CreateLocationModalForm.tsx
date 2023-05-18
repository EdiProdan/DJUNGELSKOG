import React from "react";

import { useQuery } from "@tanstack/react-query";
import { Form, useFormikContext } from "formik";

import { CityRequest } from "../../api/location/types";
import paths from "../../api/paths";
import { CityResponse } from "../../pages/Locations/types";
import ActionButton from "../ActionButton/ActionButton";
import { useClient } from "../ClientProvider/ClientProvider";
import Select from "../Formik/Select";
import SwitchComponent from "../Formik/SwitchComponent";
import TextInput from "../Formik/TextInput";
import { LocationRequest } from "../LocationModal/LocationModal";

type LocationModalFormProps = {
  onClose?: () => void;
  isEdit?: boolean;
  fetchCity?: boolean;
};

export default function CreateLocationModalForm({ onClose, isEdit, fetchCity = true }: LocationModalFormProps) {
  const { client } = useClient();

  const { errors, touched, initialValues } = useFormikContext<LocationRequest>();

  const [cityFound, setCityFound] = React.useState<boolean>(true);

  useQuery<CityResponse, string>({
    queryKey: ["city", initialValues.cityName],
    queryFn: () => client.post(paths.locations.cities.find, { name: initialValues.cityName } as CityRequest),
    onSuccess: () => {
      setCityFound(true);
    },
    onError: () => {
      setCityFound(false);
    },
    enabled: !!client.token && fetchCity,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return (
    <Form className="flex flex-col gap-4">
      <TextInput name="name" label="Ime lokacije" type="text" errors={errors} touched={touched} />
      <TextInput
        name="lat"
        label="Zemljopisna širina"
        type="number"
        errors={errors}
        touched={touched}
        disabled={isEdit}
      />
      <TextInput
        name="lng"
        label="Zemljopisna dužina"
        type="number"
        errors={errors}
        touched={touched}
        disabled={isEdit}
      />
      <Select
        label="Tip lokacije"
        list={["MUSEUM", "STADIUM", "CHURCH", "OTHER"]}
        displayValues={["Muzej", "Stadion", "Crkva", "Ostalo"]}
        name="type"
      />
      <TextInput name="cityName" label="Grad" type="text" errors={errors} touched={touched} disabled={fetchCity} />
      {!cityFound && fetchCity && (
        <>
          <div className="flex flex-row items-center gap-4">
            <div className="text-sm">Glavni grad</div>
            <SwitchComponent name="isCapitalCity" />
          </div>
          <div className="text-red-400 text-sm">Grad nije prethodno pohranjen, biti će dodan kao novi zapis.</div>
        </>
      )}
      <div className="flex flex-row w-full gap-8 mt-4">
        <ActionButton text="Odustani" type="button" onClick={onClose} className="bg-red-400 flex-grow" />
        <ActionButton text="Spremi" type="submit" className="flex-grow" />
      </div>
    </Form>
  );
}
