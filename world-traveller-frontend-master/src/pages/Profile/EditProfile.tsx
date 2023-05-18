import React from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

import { useCurrentUser } from "../../Router";
import paths from "../../api/paths";
import { EditUserProfileCommand, UserProfilePictureResponse, UserProfileResponse } from "../../api/userProfile/types";
import Card from "../../components/Card/Card";
import { useClient } from "../../components/ClientProvider/ClientProvider";
import FormWrapper, { parseError } from "../../components/Formik/FormWrapper";
import { base64Decode } from "../../components/Image/ImageWrapper";
import CreateBadgePicture from "../CreateBadge/CreateBadgePicture";
import EditProfileForm from "./EditProfileForm";

export type ProfileForm = {
  name: string;
  surname: string;
  email: string;
  publicProfile: boolean;
  image: string;
};

const ValidationSchema = Yup.object().shape({
  name: Yup.string().required("Ime je obavezno").max(50, "Ime ne može biti duže od 50 znakova"),
  surname: Yup.string().required("Prezime je obavezno").max(50, "Prezime ne može biti duže od 50 znakova"),
  email: Yup.string().email().required("Email je obavezan").max(255, "Email ne može biti duži od 255 znakova"),
  isPublic: Yup.boolean(),
});

export default function EditProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { client } = useClient();
  const currentUser = useCurrentUser();

  const { mutate: mutateProfile, isError } = useMutation<void, string, EditUserProfileCommand>({
    mutationKey: ["editProfile"],
    mutationFn: (editUserProfileCommand) => client.post(paths.userProfile.edit, editUserProfileCommand),
    onSuccess: () => {
      navigate("/userProfile");
    },
    onError: (error) => parseError(error),
  });

  const {
    data: userProfile,
    isLoading: userProfileLoading,
    isError: userProfileError,
  } = useQuery<UserProfileResponse, string>({
    queryKey: ["UserProfile", id],
    queryFn: () => client.get(paths.userProfile.get(id)),
    enabled: !!client.token,
  });

  const {
    data: image,
    isLoading: loading,
    isError: error,
  } = useQuery<UserProfilePictureResponse, string>({
    queryKey: ["UserProfileImage", id],
    queryFn: () => client.get(paths.userProfile.getPicture(currentUser.id)),
    enabled: !!client.token && !!userProfile,
  });

  const [initialValues, setInitialValues] = React.useState<ProfileForm>();

  React.useEffect(() => {
    if (loading || error) return;
    if (userProfileLoading || userProfileError) return;

    setInitialValues({
      name: userProfile.user.name || "",
      surname: userProfile.user.surname || "",
      email: userProfile.user.email || "",
      publicProfile: userProfile.isPublic || userProfile.public,
      image: image.image ? base64Decode(image.image) : "",
    });
  }, [image, loading, error, userProfile, userProfileLoading, userProfileError]);

  return (
    <div className="flex xl:flex-row flex-col items-center xl:items-start w-full px-20 pt-10">
      {initialValues && (
        <Formik
          initialValues={initialValues}
          onSubmit={async (values) => {
            const img = values.image
              ? await fetch(values.image)
                  .then((image) => image.blob())
                  .then((image) => image.arrayBuffer())
                  .then((image) => Array.from(new Uint8Array(image)))
              : undefined;

            mutateProfile({
              name: values.name,
              surname: values.surname,
              publicProfile: values.publicProfile,
              email: values.email,
              image: img,
            } as EditUserProfileCommand);
          }}
          validationSchema={ValidationSchema}
        >
          <FormWrapper isError={isError}>
            <Card className="lg:w-1/4 md:w-1/2 m-5 h-min p-6">
              <CreateBadgePicture />
            </Card>
            <Card className="w-3/4 m-5 h-min p-6">
              <EditProfileForm />
            </Card>
          </FormWrapper>
        </Formik>
      )}
    </div>
  );
}
