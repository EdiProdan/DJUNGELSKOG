import React from "react";

import { Form, useFormikContext } from "formik";
import { useNavigate } from "react-router-dom";

import ActionButton from "../../components/ActionButton/ActionButton";
import SwitchComponent from "../../components/Formik/SwitchComponent";
import TextInput from "../../components/Formik/TextInput";
import { ProfileForm } from "./EditProfile";

export default function EditProfileForm() {
  const { errors, touched, isSubmitting } = useFormikContext<ProfileForm>();
  const navigate = useNavigate();

  return (
    <Form className="flex flex-col">
      <h1 className="text-2xl mb-6 font-bold">Uredi profil</h1>
      <TextInput name="name" label="Ime" type="text" errors={errors} touched={touched} className="mb-6" />
      <TextInput name="surname" label="Prezime" type="text" errors={errors} touched={touched} className="mb-6" />
      <TextInput name="email" label="Email" type="text" errors={errors} touched={touched} className="mb-6" />
      <div className="mb-6 flex">
        <label className="block font-medium text-gray-700 mr-5">Javni profil: </label>
        <SwitchComponent name="publicProfile" />
      </div>
      <div className="ml-auto">
        <ActionButton text="Odustani" className="mr-5 bg-rose-400" onClick={() => navigate("/userProfile")} />
        <ActionButton text="Spremi" className="" type="submit" isDisabled={isSubmitting} />
      </div>
    </Form>
  );
}
