import React from "react";

/*eslint import/namespace: ['error', { allowComputed: true }]*/
import * as OutlineIcons from "@heroicons/react/outline";
import * as SolidIcons from "@heroicons/react/solid";

type IconProps = {
  name: keyof typeof OutlineIcons;
  type?: "outline" | "solid";
};

export default function Icon({ name, type = "outline" }: IconProps) {
  const iconClasses = "h-8";

  if (type === "solid") {
    const Icon = SolidIcons[name];
    return <Icon className={iconClasses} />;
  }

  const Icon = OutlineIcons[name];

  return <Icon className={iconClasses} />;
}
