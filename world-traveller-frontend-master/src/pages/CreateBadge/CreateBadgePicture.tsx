import React from "react";

import { TrashIcon } from "@heroicons/react/solid";
import { Field, useFormikContext } from "formik";
import { ImageType } from "react-images-uploading";

import { ImageUpload } from "../../components/Image/ImageUpload";

export default function CreateBadgePicture<T>() {
  const { values, setFieldValue } = useFormikContext<T>();

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <ImageUpload
          alt={"image"}
          onChangeImage={function (image: ImageType): void {
            setFieldValue("image", image.dataURL);
            <Field name={"image"} values={values} />;
          }}
          rounded={true}
          defaultImageURL={String(values["image" as keyof T])}
        />
        <TrashIcon
          className="bg-red-500 absolute rounded-full bottom-0 right-0 px-3 py-3 w-10 h-10 z-10 cursor-pointer hover:bg-red-600"
          onClick={function (): void {
            setFieldValue("image", "");
          }}
        />
      </div>
    </div>
  );
}
