import React from "react";

import { BadgeResponse } from "../../api/badge/types";
import Badge from "./Badge";

interface BadgeListProps {
  badges: BadgeResponse[];
}

export default function BadgeList({ badges }: BadgeListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 overflow-x-auto max-h-[500px] gap-10">
      {badges.map((badge) => (
        <Badge badge={badge} key={badge.id} cardType={"full"} />
      ))}
    </div>
  );
}
