import React from "react";

import { UploadIcon } from "@heroicons/react/solid";
import ImageUploading, { ImageListType, ImageType } from "react-images-uploading";

import ImageWrapper from "./ImageWrapper";

type ImageUploadProps = {
  defaultImageURL?: string;
  alt: string;
  className?: string;
  rounded?: boolean;
  onChangeImage: (image: ImageType) => void;
};

export function ImageUpload({ defaultImageURL, alt, className, rounded = false, onChangeImage }: ImageUploadProps) {
  const [images, setImages] = React.useState([]);

  const onChange = (imageList: ImageListType) => {
    setImages(imageList as never[]);

    if (imageList.at(0)) {
      onChangeImage(imageList.at(0) as ImageType);
    }
  };

  return (
    <ImageUploading value={images} onChange={onChange}>
      {({ imageList, onImageUpload, isDragging, dragProps }) => (
        <div className={`relative ${isDragging ? "blur-sm" : ""}`}>
          <button onClick={onImageUpload} {...dragProps}>
            <UploadIcon className="absolute top-1/3 left-1/3 w-1/3 h-1/3" />

            <ImageWrapper
              alt={alt}
              className={className}
              imageURL={imageList.at(0) ? imageList.at(0)?.dataURL : defaultImageURL}
              rounded={rounded}
            />
          </button>
        </div>
      )}
    </ImageUploading>
  );
}
