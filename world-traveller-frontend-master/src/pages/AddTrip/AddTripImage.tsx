import React from "react";

import { Field, useFormikContext } from "formik";
import { ImageType } from "react-images-uploading";

import { TripCreateRequest } from "../../api/trips/types";
import { ImageUpload } from "../../components/Image/ImageUpload";

export default function AddTripImage() {
  const { values, setFieldValue, errors } = useFormikContext<TripCreateRequest>();

  return (
    <div className="relative sm:w-96">
      <ImageUpload
        alt={"image"}
        onChangeImage={function (image: ImageType): void {
          setFieldValue("image", image.dataURL);
          <Field name={"image"} values={values} />;
        }}
        rounded={false}
        className="rounded-2xl"
      />
      {errors.image && <div className="absolute z-50 text-red-500 bottom-6 right-6">{errors.image}</div>}
    </div>
  );
}
