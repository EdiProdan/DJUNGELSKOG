import React from "react";

import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import djungelskogUrl from "../../../assets/djungelskog.png";
import { JwtAuthenticatedResponse, RegisterCommand } from "../../api/auth/types";
import paths from "../../api/paths";
import { useAppContext } from "../../components/AuthInterceptor/AuthInterceptor";
import { useClient } from "../../components/ClientProvider/ClientProvider";
import FormWrapper, { parseError } from "../../components/Formik/FormWrapper";
import RegisterForm from "./RegisterForm";

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required("Ime je obavezno"),
  surname: Yup.string().required("Prezime je obavezno"),
  email: Yup.string().required("Email je obavezan").email("Email nije ispravan"),
  username: Yup.string().required("Korisničko ime je obavezno"),
  password: Yup.string().required("Lozinka je obavezna"),
});

export default function Login() {
  const navigate = useNavigate();
  const { setToken } = useAppContext();
  const { client } = useClient();

  const { mutate, isError } = useMutation<JwtAuthenticatedResponse, string, RegisterCommand>({
    mutationKey: ["register"],
    mutationFn: (registerCommand) => client.post(paths.auth.register, registerCommand),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      if (setToken) setToken(data.token);
      navigate("/");
    },
    onError: (error) => parseError(error),
  });

  const initialValues: RegisterCommand = {
    username: "",
    password: "",
    email: "",
    name: "",
    surname: "",
  };

  return (
    <div className="flex xl:flex-row flex-col-reverse h-screen overflow-hidden">
      <div className={`flex flex-grow bg-base-bg`}>
        <Formik initialValues={initialValues} onSubmit={(values) => mutate(values)} validationSchema={ValidationSchema}>
          <FormWrapper isError={isError}>
            <RegisterForm />
          </FormWrapper>
        </Formik>
      </div>
      <div
        className={`xl:w-3/5 w-full xl:grid xl:grid-cols-2 bg-base flex flex-row justify-center content-center items-center xl:p-0 py-4`}
      >
        <img src={djungelskogUrl} alt="" className="max-h-96 h-32 xl:h-max justify-self-end pr-10" />
        <h1 className="pl-10 text-5xl text-white hidden sm:block">DJUNGELSKOG</h1>
      </div>
    </div>
  );
}
