import React from "react";

import { BadgeResponse } from "../../api/badge/types";
import FullCard from "./FullCard";
import ShortCard from "./ShortCard";

type BadgeProps = {
  badge: BadgeResponse;
  cardType: string;
};

export default function Badge({ badge, cardType }: BadgeProps) {
  return (
    <>
      {cardType === "collapse" && <ShortCard badge={badge} />}
      {cardType === "full" && <FullCard badge={badge} />}
    </>
  );
}
