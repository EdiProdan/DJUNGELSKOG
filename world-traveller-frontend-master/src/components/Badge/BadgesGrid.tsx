import React from "react";

import { BadgeResponse } from "../../api/badge/types";
import FullCard from "./FullCard";

type BadgesGridProps = {
  badges: BadgeResponse[];
};

export default function BadgesGrid({ badges }: BadgesGridProps) {
  return (
    <div className="grid 2xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 justify-items-center gap-4">
      {badges.map((badge) => (
        <FullCard key={badge.id} badge={badge} />
      ))}
    </div>
  );
}
