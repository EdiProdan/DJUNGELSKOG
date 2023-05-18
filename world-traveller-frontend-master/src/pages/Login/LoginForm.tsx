import React from "react";

import { Form, useFormikContext } from "formik";
import { Link } from "react-router-dom";

import { LoginCommand } from "../../api/auth/types";
import ActionButton from "../../components/ActionButton/ActionButton";
import TextInput from "../../components/Formik/TextInput";

export default function LoginForm() {
  const { errors, touched, isSubmitting } = useFormikContext<LoginCommand>();

  return (
    <Form className="flex w-full flex-col justify-center items-center">
      <h1 className="mb-24 text-3xl 2xl:text-5xl">Dobrodošli natrag.</h1>
      <TextInput
        name="username"
        label="Korisničko ime"
        type="text"
        errors={errors}
        touched={touched}
        className="xl:w-1/2 w-80 mb-6"
      />
      <TextInput
        name="password"
        label="Lozinka"
        type="password"
        errors={errors}
        touched={touched}
        className="xl:w-1/2 w-80 mb-12"
      />
      <ActionButton text="Prijavi se" className="xl:w-1/2 w-80" type="submit" isDisabled={isSubmitting} />
      <p className="mt-6">
        Nemaš račun?{" "}
        <Link to="/register" className={`text-base font-medium`}>
          Registriraj se
        </Link>
      </p>
    </Form>
  );
}
