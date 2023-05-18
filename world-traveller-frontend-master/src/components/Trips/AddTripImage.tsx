import React from "react";

import { Field, useFormikContext } from "formik";
import { ImageType } from "react-images-uploading";

import { ImageUpload } from "../Image/ImageUpload";

export default function AddTrip() {
  const { values, setFieldValue } = useFormikContext();

  return (
    <ImageUpload
      alt={"image"}
      onChangeImage={function (image: ImageType): void {
        setFieldValue("image", image.dataURL);
        <Field name={"image"} values={values} />;
      }}
      rounded={false}
    />
  );
}
