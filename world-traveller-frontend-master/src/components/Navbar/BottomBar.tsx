import React from "react";

import { Link, useLocation } from "react-router-dom";

import Icon from "../Icon/Icon";
import { NavbarRoute } from "./Navbar";

type BottomBarProps = {
  topRoutes: NavbarRoute[];
  bottomRoutes: NavbarRoute[];
  isNested?: boolean;
  className?: string;
  logout?: () => void;
};

export default function BottomBar({ topRoutes, bottomRoutes, isNested, logout, className }: BottomBarProps) {
  const { pathname } = useLocation();

  return (
    <div className={`w-full bg-base p-6 flex flex-row gap-2 text-white ${className}`}>
      {topRoutes.map((route, index) => (
        <React.Fragment key={route.path}>
          <NavbarLink route={route} selected={pathname === route.path} />
          {isNested && index === 0 && <div className="h-12 w-0.5 bg-white rounded-full"></div>}
        </React.Fragment>
      ))}
      <div className="flex flex-grow"></div>
      <NavbarLink logout={logout} />
      <div className="h-12 w-0.5 bg-white rounded-full"></div>
      {bottomRoutes.map((route) => (
        <NavbarLink key={route.path} route={route} selected={pathname.startsWith(route.path)} />
      ))}
    </div>
  );
}

type NavbarLinkProps = {
  route?: NavbarRoute;
  selected?: boolean;
  logout?: () => void;
};

function NavbarLink({ route, selected, logout }: NavbarLinkProps) {
  const { pathname } = useLocation();

  const className = `flex flex-row items-center gap-4 rounded-xl p-2 h-12 hover:pb-4 transform duration-200 relative ${
    selected ? "bg-base-bg" : "rounded-none"
  }`;
  const textWhite = "text-white";

  if (logout) {
    return (
      <div className={`cursor-pointer ${className}`} onClick={() => logout()}>
        <div className={`${textWhite}`}>
          <Icon name={"LogoutIcon"} type={"outline"} />
        </div>
      </div>
    );
  }

  if (!route) {
    return (
      <Link to={pathname} className={className}>
        <div className={`${textWhite}`}>
          <Icon name={"CubeTransparentIcon"} type={"outline"} />
        </div>
      </Link>
    );
  }

  return (
    <Link to={route.children ? route.children[0].path : route.path} className={className}>
      <div className={`${selected ? "text-base" : textWhite}`}>
        <Icon name={route.icon} type={selected ? "solid" : "outline"} />
      </div>
    </Link>
  );
}
