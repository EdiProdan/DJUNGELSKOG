import React from "react";

import { Link, useLocation } from "react-router-dom";

import Icon from "../Icon/Icon";
import { NavbarRoute } from "./Navbar";

type NavbarLinkProps = {
  route?: NavbarRoute;
  selected?: boolean;
  logout?: () => void;
};

export default function NavbarLink({ route, selected, logout }: NavbarLinkProps) {
  const { pathname } = useLocation();

  const className = `flex flex-row items-center gap-4 rounded-xl p-2 h-12 hover:pl-4 transform duration-200 relative ${
    selected ? "bg-base-bg" : "rounded-none"
  }`;
  const textWhite = "text-white";

  if (logout) {
    return (
      <div className={`cursor-pointer ${className}`} onClick={() => logout()}>
        <div className="absolute h-full w-full flex flex-row items-center hover:pl-2 transform duration-200">
          <div className="relative bg-base-bg w-3 h-6 rounded-r-full -left-12"></div>
        </div>
        <div className={`${textWhite}`}>
          <Icon name={"MinusCircleIcon"} type={"outline"} />
        </div>
        <h3 className={`flex flex-col justify-center ${textWhite}`}>Odjava</h3>
      </div>
    );
  }

  if (!route) {
    return (
      <Link to={pathname} className={className}>
        <div className="absolute h-full w-full flex flex-row items-center hover:pl-2 transform duration-200">
          <div className="relative bg-base-bg w-3 h-6 rounded-r-full -left-12"></div>
        </div>
        <div className={`${textWhite}`}>
          <Icon name={"CubeTransparentIcon"} type={"outline"} />
        </div>
        <h3 className={`flex flex-col justify-center ${textWhite}`}>Link</h3>
      </Link>
    );
  }

  return (
    <Link to={route.children ? route.children[0].path : route.path} className={className}>
      <div className="absolute h-full w-full flex flex-row items-center hover:pl-2 transform duration-200">
        <div className="relative bg-base-bg w-3 h-6 rounded-r-full -left-12"></div>
      </div>
      <div className={`${selected ? "text-base" : textWhite}`}>
        <Icon name={route.icon} type={selected ? "solid" : "outline"} />
      </div>
      <h3 className={`flex flex-col justify-center ${selected ? "text-base" : textWhite}`}>{route.name}</h3>
    </Link>
  );
}
