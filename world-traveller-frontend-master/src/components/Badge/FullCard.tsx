import React from "react";

import { BadgeResponse } from "../../api/badge/types";
import Card from "../Card/Card";
import ImageWrapper from "../Image/ImageWrapper";

export default function FullCard({ badge }: { badge: BadgeResponse }) {
  return (
    <Card className="grid grid-cols-3 max-w-sm w-96 p-4">
      <div className="col-span-1 place-items-center">
        <ImageWrapper
          alt={"image"}
          className={"h-20 w-20 mr-2"}
          imageURL={badge.image}
          base64Encoded={true}
          rounded={true}
        />
      </div>
      <div className="col-span-2">
        <h3 className="m-auto font-bold">{badge.name}</h3>
        <p className="m-auto line-clamp-2">{badge.description}</p>
      </div>
    </Card>
  );
}
