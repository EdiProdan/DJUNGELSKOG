import React from "react";

import { BadgeResponse } from "../../api/badge/types";
import ImageWrapper from "../Image/ImageWrapper";

type ShortCardProps = {
  badge: BadgeResponse;
  className?: string;
};

export default function ShortCard({ badge, className }: ShortCardProps) {
  return (
    <div className={`p-2 text-center flex flex-col items-center gap-2 ${className}`}>
      <ImageWrapper imageURL={badge.image} alt="" className="h-28 w-28 rounded-full bg-base" />
      <div className="w-full">
        <h3 className="truncate">{badge.name}</h3>
      </div>
    </div>
  );
}
