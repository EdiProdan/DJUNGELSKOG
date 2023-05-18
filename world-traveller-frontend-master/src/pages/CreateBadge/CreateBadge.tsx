import React from "react";

import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {} from "../../../assets/djungelskog.png";

import { useCurrentUser } from "../../Router";
import { CityBadgeRequirement, CreateCityBadgeCommand, CreateCountryBadgeCommand } from "../../api/createBadge/types";
import { LocationTypes } from "../../api/location/types";
import paths from "../../api/paths";
import Card from "../../components/Card/Card";
import { useClient } from "../../components/ClientProvider/ClientProvider";
import FormWrapper, { parseError } from "../../components/Formik/FormWrapper";
import CreateBadgeForm from "./CreateBadgeForm";
import CreateBadgePicture from "./CreateBadgePicture";

export type BadgeForm = {
  badgeName: string;
  visitCapitalCity: boolean;
  requiredNumber: number;
  type: string;
  image: string;
  badgeType: string;
  requiredLocations: number;
  requirements: CityBadgeRequirement[];
};

const ValidationSchema = Yup.object().shape({
  badgeName: Yup.string().required("Naziv je obavezan"),
  visitCapitalCity: Yup.boolean(),
  requiredNumber: Yup.number(),
  type: Yup.string(),
  image: Yup.string(),
  requiredLocations: Yup.number(),
  requirements: Yup.array(),
  badgeType: Yup.string(),
});

export default function CreateBadge() {
  const navigate = useNavigate();
  const { client } = useClient();
  const currentUser = useCurrentUser();

  const { mutate: mutateCountry, isError: countryError } = useMutation<void, string, CreateCountryBadgeCommand>({
    mutationKey: ["createCountryBadge"],
    mutationFn: (createCountryBadgeCommand) => client.post(paths.badges.create.country, createCountryBadgeCommand),
    onSuccess: () => {
      navigate("/manageBadges");
    },
    onError: (error) => parseError(error),
  });

  const { mutate: mutateCity, isError: cityError } = useMutation<void, string, CreateCityBadgeCommand>({
    mutationKey: ["createCityBadge"],
    mutationFn: (createCityBadgeCommand) => client.post(paths.badges.create.city, createCityBadgeCommand),
    onSuccess: () => {
      navigate("/manageBadges");
    },
    onError: (error) => parseError(error),
  });

  const initialValues: BadgeForm = {
    badgeName: "",
    visitCapitalCity: false,
    requiredNumber: 1,
    type: "Gradova",
    image: "",
    badgeType: "Država",
    requiredLocations: 1,
    requirements: [{ requiredLocations: 1, locationType: LocationTypes.MUSEUM }],
  };

  if (currentUser.roles.includes("ADMIN") || currentUser.roles.includes("CARTOGRAPHER")) {
    return (
      <div className="flex xl:flex-row flex-col items-center xl:items-start w-full px-20 pt-10">
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, helpers) => {
            const img = values.image
              ? await fetch(values.image)
                  .then((image) => image.blob())
                  .then((image) => image.arrayBuffer())
                  .then((image) => Array.from(new Uint8Array(image)))
              : undefined;

            if (values.badgeType === "Država") {
              mutateCountry({
                badgeName: values.badgeName,
                visitCapitalCity: values.visitCapitalCity,
                requiredNumber: values.requiredNumber,
                type: values.type,
                image: img,
              } as CreateCountryBadgeCommand);
            } else if (values.badgeType === "Grad") {
              mutateCity({
                badgeName: values.badgeName,
                requiredLocations: values.requiredLocations,
                requirements: values.requirements,
                image: img,
              } as CreateCityBadgeCommand);
            }
            helpers.setSubmitting(false);
          }}
          validationSchema={ValidationSchema}
        >
          <FormWrapper isError={countryError || cityError}>
            <Card className="lg:w-1/4 md:w-1/2 m-5 h-min p-6">
              <CreateBadgePicture />
            </Card>
            <Card className="w-3/4 m-5 h-min p-6">
              <CreateBadgeForm />
            </Card>
          </FormWrapper>
        </Formik>
      </div>
    );
  } else {
    return (
      <div>
        <h1 className="text-4xl text-center">Nemate pravo pristupa ovoj stranici</h1>
      </div>
    );
  }
}
