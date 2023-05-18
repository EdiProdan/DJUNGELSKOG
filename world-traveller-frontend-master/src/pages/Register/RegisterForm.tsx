import React from "react";

import { Form, useFormikContext } from "formik";
import { Link } from "react-router-dom";

import { LoginCommand } from "../../api/auth/types";
import ActionButton from "../../components/ActionButton/ActionButton";
import TextInput from "../../components/Formik/TextInput";

export default function RegisterForm() {
  const { errors, touched, isSubmitting } = useFormikContext<LoginCommand>();

  return (
    <Form className="flex w-full flex-col justify-center items-center">
      <h1 className="mb-10 text-3xl 2xl:text-5xl">Stvori račun.</h1>
      <TextInput name="name" label="Ime" type="text" errors={errors} touched={touched} className="xl:w-1/2 w-80 mb-6" />
      <TextInput
        name="surname"
        label="Prezime"
        type="text"
        errors={errors}
        touched={touched}
        className="xl:w-1/2 w-80 mb-6"
      />
      <TextInput
        name="email"
        label="Email:"
        type="text"
        errors={errors}
        touched={touched}
        className="xl:w-1/2 w-80 mb-6"
      />
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
        className="xl:w-1/2 w-80 mb-6"
      />
      <ActionButton text="Registriraj se" className="w-1/2" type="submit" isDisabled={isSubmitting} />
      <p className="mt-6">
        <Link to="/login" className={`text-base font-medium`}>
          Nazad na prijavu
        </Link>
      </p>
    </Form>
  );
}
