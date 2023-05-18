import React from "react";

type ImageWrapperProps = {
  imageURL?: string;
  alt: string;
  className?: string;
  rounded?: boolean;
  base64Encoded?: boolean;
};

export const base64Decode = (base64Encoded: string) => {
  const imageBytes = atob(base64Encoded);
  const imageArray = new Uint8Array(imageBytes.split("").map((char) => char.charCodeAt(0)));
  return URL.createObjectURL(new Blob([imageArray], { type: "image/png" }));
};

export default function ImageWrapper({
  imageURL,
  alt,
  className,
  rounded = false,
  base64Encoded = false,
}: ImageWrapperProps) {
  if (imageURL && base64Encoded) {
    imageURL = base64Decode(imageURL);
  }

  return (
    <div
      className={`overflow-hidden aspect-square ${rounded ? "rounded-full " : ""} ${
        className ? className : ""
      } bg-base`}
    >
      <img
        src={imageURL ? imageURL : new URL("../../../assets/djungelskog.png", import.meta.url).href}
        alt={alt}
        className="object-cover h-full w-full "
      />
    </div>
  );
}
