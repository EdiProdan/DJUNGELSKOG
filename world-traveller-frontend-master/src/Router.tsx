import React from "react";

import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { AuthenticatedUserResponse } from "./api/auth/types";
import { useAppContext } from "./components/AuthInterceptor/AuthInterceptor";
import AddTrip from "./pages/AddTrip/AddTrip";
import ApplicationFrame from "./pages/ApplicationFrame";
import Badges from "./pages/Badges/Badges";
import CreateBadge from "./pages/CreateBadge/CreateBadge";
import CreateWishlist from "./pages/CreateWishlist/CreateWishlist";
import Home from "./pages/Home/Home";
import LocationSuggestions from "./pages/LocationSuggestions/LocationSuggestions";
import Locations from "./pages/Locations/Locations";
import Login from "./pages/Login/Login";
import ManageBadges from "./pages/ManageBadges/ManageBadges";
import ManageUsers from "./pages/ManageUsers/ManageUsers";
import EditProfile from "./pages/Profile/EditProfile";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Register/Register";
import SearchUser from "./pages/SearchUser/SearchUser";
import Social from "./pages/Social/Social";
import Wishlist from "./pages/Wishlist/Wishlist";

export default function Router() {
  const context = useAppContext();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute user={context.auth.user} requiredRoles={[]}>
            <ApplicationFrame />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/wishlist/create" element={<CreateWishlist />} />
        <Route path="/userProfile" element={<Profile />} />
        <Route path="/userProfile/:id" element={<Profile />} />
        <Route path="/userProfile/edit" element={<EditProfile />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="/badges/create" element={<CreateBadge />} />
        <Route path="/trips/add" element={<AddTrip />} />
        <Route path="/social" element={<Social />} />
        <Route
          path="/manageBadges"
          element={
            <ProtectedRoute user={context.auth.user} requiredRoles={["ADMIN", "CARTOGRAPHER"]}>
              <ManageBadges />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute user={context.auth.user} requiredRoles={["ADMIN"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/locations"
          element={
            <ProtectedRoute user={context.auth.user} requiredRoles={["ADMIN"]}>
              <Locations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/locations/suggestions"
          element={
            <ProtectedRoute user={context.auth.user} requiredRoles={["ADMIN"]}>
              <LocationSuggestions />
            </ProtectedRoute>
          }
        />
        <Route path="/searchUser" element={<SearchUser />} />
      </Route>
      <Route path="*" element={<>404 Not found</>} />
    </Routes>
  );
}

type ProtectedRouteContextType = {
  user: AuthenticatedUserResponse;
};

const ProtectedRouteContext = React.createContext<ProtectedRouteContextType>({ user: {} as AuthenticatedUserResponse });

type ProtectedRouteProps = {
  user: AuthenticatedUserResponse | undefined;
  children: React.ReactNode;
  requiredRoles: string[];
};

function ProtectedRoute({ user, children, requiredRoles }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  React.useEffect(() => {
    if (requiredRoles.length === 0) return;

    if (!requiredRoles.some((role) => user?.roles.includes(role))) {
      navigate("/");
    }
  }, [user, requiredRoles, navigate, pathname]);

  return user ? <ProtectedRouteContext.Provider value={{ user }}>{children}</ProtectedRouteContext.Provider> : <></>;
}

export function useCurrentUser() {
  const { user } = React.useContext(ProtectedRouteContext);

  return user;
}
