import React from "react";

import { FieldArray, Form, useFormikContext } from "formik";
import { useNavigate } from "react-router";

import { CityBadgeRequirement, CreateCityBadgeCommand, CreateCountryBadgeCommand } from "../../api/createBadge/types";
import { LocationTypes } from "../../api/location/types";
import ActionButton from "../../components/ActionButton/ActionButton";
import RadioGroupComponent from "../../components/Formik/RadioGroupComponent";
import Select from "../../components/Formik/Select";
import SwitchComponent from "../../components/Formik/SwitchComponent";
import TextInput from "../../components/Formik/TextInput";
import { BadgeForm } from "../../pages/CreateBadge/CreateBadge";

export default function CreateBadgeForm() {
  const { errors, touched, isSubmitting, values } = useFormikContext<BadgeForm>();
  const navigate = useNavigate();

  return (
    <Form className="flex flex-col">
      <h1 className="text-2xl 2xl:text-5xl mb-6">Dodaj novi bedž</h1>
      <TextInput name="badgeName" label="Naziv" type="text" errors={errors} touched={touched} className="mb-6" />
      <RadioGroupComponent className="mb-6" label="Tip:" name="badgeType" list={["Država", "Grad"]} />
      <h3 className="mb-6 font-bold text-2xl">Pravila bedža:</h3>
      {values.badgeType === "Država" ? (
        <>
          <div className="mb-6 flex">
            <label className="block font-medium text-gray-700 mr-5">Posjeti glavni grad</label>
            <SwitchComponent name="visitCapitalCity" />
          </div>
          <div className="mb-6 flex">
            <label className="font-medium text-gray-700 mr-5">Posjeti: </label>
            <Select<CreateCountryBadgeCommand> name="requiredNumber" list={[1, 2, 3, 4]} className="mr-5 w-20" />
            <Select<CreateCountryBadgeCommand> list={["Gradova", "Lokacija"]} name="type" className="w-72" />
          </div>
        </>
      ) : (
        <>
          <div className="mb-6 flex">
            <label className="font-medium text-gray-700 mr-5">Posjeti: </label>
            <Select<CreateCityBadgeCommand> list={[1, 2]} name="requiredLocations" className="mr-5 w-20 z-10" />
            <label className="font-medium text-gray-700 mr-5">lokacija od kojih je: </label>
          </div>
          <div className="mb-6">
            <FieldArray name="requirements">
              {(helpers) => {
                const { push, form, remove } = helpers;
                return (
                  <div>
                    {form.values.requirements.map((requirement: CityBadgeRequirement, index: number) => (
                      <div key={index} className="flex mb-5">
                        <Select
                          list={[1, 2, 3, 4]}
                          name={`requirements.${index}.requiredLocations`}
                          className="mr-5 w-20"
                        />
                        <Select
                          list={[
                            LocationTypes.MUSEUM,
                            LocationTypes.STADIUM,
                            LocationTypes.CHURCH,
                            LocationTypes.OTHER,
                          ]}
                          name={`requirements.${index}.locationType`}
                          displayValues={["Muzeja", "Stadiona", "Crkvi", "Ostalog"]}
                          className="mr-5 w-72"
                        />
                        <button type="button" onClick={() => remove(index)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push({ requiredLocations: 1, locationType: LocationTypes.MUSEUM })}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>
                );
              }}
            </FieldArray>
          </div>
        </>
      )}

      <div className="ml-auto">
        <ActionButton text="Odustani" className="mr-5 bg-rose-400" onClick={() => navigate("/manageBadges")} />
        <ActionButton text="Spremi" className="" type="submit" isDisabled={isSubmitting} />
      </div>
    </Form>
  );
}
