import React from "react";

import * as Icons from "@heroicons/react/outline";
import { useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { useLocation, useNavigate } from "react-router-dom";

import { useCurrentUser } from "../../Router";
import paths from "../../api/paths";
import { useClient } from "../ClientProvider/ClientProvider";
import BottomBar from "./BottomBar";
import Sidebar from "./Sidebar";

export type NavbarRoute = {
  path: string;
  name: string;
  icon: keyof typeof Icons;
  children?: NavbarRoute[];
  stackOnBottom?: boolean;
  parentPath?: string;
  backTo?: string;
  requiredRoles?: string[];
};

const routes: NavbarRoute[] = [
  {
    path: "/",
    name: "Početna",
    icon: "HomeIcon",
  },
  {
    path: "/badges",
    name: "Bedževi",
    icon: "BadgeCheckIcon",
  },
  {
    path: "/wishlist",
    name: "Lista želja",
    icon: "ClipboardListIcon",
  },
  {
    path: "/trips/add",
    name: "Dodaj putovanje",
    icon: "PlusIcon",
  },
  {
    path: "/social",
    name: "Društvo",
    icon: "UsersIcon",
  },
  {
    path: "/searchUser",
    name: "Pretraži korisnike",
    icon: "SearchIcon",
  },
  {
    path: "/manageBadges",
    name: "Upravljanje bedževima",
    icon: "ArchiveIcon",
    stackOnBottom: true,
    requiredRoles: ["ADMIN", "CARTOGRAPHER"],
  },
  {
    path: "/admin",
    name: "Admin panel",
    icon: "CogIcon",
    stackOnBottom: true,
    backTo: "/",
    requiredRoles: ["ADMIN"],
    children: [
      {
        path: "/admin/users",
        name: "Korisnici",
        icon: "UserGroupIcon",
        parentPath: "/admin",
      },
      {
        path: "/admin/locations",
        name: "Lokacije",
        icon: "LocationMarkerIcon",
        parentPath: "/admin",
      },
      {
        path: "/admin/locations/suggestions",
        name: "Prijedlozi lokacija",
        icon: "NewspaperIcon",
        parentPath: "/admin",
      },
    ],
  },
  {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    path: "/userProfile",
    name: "Profil",
    icon: "UserIcon",
    stackOnBottom: true,
  },
];

const findCurrentRoute = (routes: NavbarRoute[] | undefined, pathname: string): NavbarRoute | undefined => {
  if (!routes) return undefined;

  for (const route of routes) {
    if (route.path === pathname) return route;
    const found = findCurrentRoute(route.children, pathname);
    if (found) return found;
  }

  return undefined;
};

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { client } = useClient();
  const currentUser = useCurrentUser();
  const queryClient = useQueryClient();

  const [topRoutes, setTopRoutes] = React.useState(routes.filter((route) => !route.stackOnBottom));
  const [bottomRoutes /* , setBottomRoutes */] = React.useState(routes.filter((route) => route.stackOnBottom));
  const [isNested, setIsNested] = React.useState(false);

  const [showSidebar, setShowSidebar] = React.useState(true);

  React.useEffect(() => {
    const currentRoute = findCurrentRoute(routes, pathname);
    const parentRoute = findCurrentRoute(routes, currentRoute?.parentPath ?? "");
    const backToRoute = findCurrentRoute(routes, parentRoute?.backTo ?? "");

    if (parentRoute?.children && backToRoute) {
      setTopRoutes([...[backToRoute], ...parentRoute.children]);
      // setBottomRoutes([]);
      setIsNested(true);
    } else {
      setTopRoutes(routes.filter((route) => !route.stackOnBottom));
      // setBottomRoutes(routes.filter((route) => route.stackOnBottom));
      setIsNested(false);
    }
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    queryClient.getQueryCache().clear();
    queryClient.clear();

    return client.post(paths.auth.logout, {});
  };

  if (bottomRoutes.every((route) => route.path !== "/userProfile")) {
    bottomRoutes.push({
      path: "/userProfile",
      name: "Profil",
      icon: "UserIcon",
      stackOnBottom: true,
    });
  }

  const handleShowSidebar = (show: boolean) => {
    if (dimensions.width >= 1024) {
      setShowSidebar(true);
      return;
    }

    setShowSidebar(show);
  };

  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  React.useEffect(() => {
    const debouncedHandleResize = _.debounce(
      () => setDimensions({ height: window.innerHeight, width: window.innerWidth }),
      500
    );

    window.addEventListener("resize", debouncedHandleResize);

    return () => window.removeEventListener("resize", debouncedHandleResize);
  }, []);

  React.useEffect(() => {
    if (dimensions.width >= 1024) {
      setShowSidebar(true);
      return;
    }

    setShowSidebar(false);
  }, [dimensions]);

  const top = topRoutes.filter((route) =>
    route.requiredRoles ? route.requiredRoles.some((role) => currentUser.roles.includes(role)) : true
  );
  const bottom = bottomRoutes.filter((route) =>
    route.requiredRoles ? route.requiredRoles.some((role) => currentUser.roles.includes(role)) : true
  );

  return (
    <nav className="fixed sm:relative w-screen sm:h-fit lg:h-full lg:w-fit lg:sticky" style={{ zIndex: 9999 }}>
      {showSidebar ? (
        <Sidebar
          topRoutes={top}
          bottomRoutes={bottom}
          isNested={isNested}
          logout={logout}
          className="fixed w-screen h-screen top-0 left-0 sm:hidden lg:relative lg:flex"
          handleShowSidebar={handleShowSidebar}
        />
      ) : (
        <div
          className="fixed sm:hidden bottom-0 left-0 m-6 p-4 flex flex-row justify-center bg-base border-4 border-base-bg rounded-full shadow-md"
          onClick={() => setShowSidebar(true)}
        >
          <Icons.MenuIcon className="h-12 text-base-bg" />
        </div>
      )}
      <BottomBar
        topRoutes={topRoutes}
        bottomRoutes={bottomRoutes}
        isNested={isNested}
        logout={logout}
        className="hidden sm:flex lg:hidden"
      />
    </nav>
  );
}
