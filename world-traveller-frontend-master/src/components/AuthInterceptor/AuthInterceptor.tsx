import React from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import Client from "../../api/RestClient";
import { JwtAuthenticatedResponse, AuthenticatedUserResponse } from "../../api/auth/types";
import paths from "../../api/paths";

export type JwtPayload = {
  exp: number;
  iat: number;
  iss: string;
  nbf: number;
  roles: string;
  username: string;
};

export type Auth = {
  user: AuthenticatedUserResponse | undefined;
  token: string | null;
};

type AuthInterceptorProps = {
  children: React.ReactNode;
};

type Context = {
  auth: Auth;
  setToken?: React.Dispatch<React.SetStateAction<string | null | undefined>>;
};

const AppContext = React.createContext<Context>({ auth: { user: undefined, token: null } });

export default function AuthInterceptor({ children }: AuthInterceptorProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();

  const [token, setToken] = React.useState<string | null | undefined>();
  const [user, setUser] = React.useState<AuthenticatedUserResponse | undefined>(
    queryClient.getQueryData(["currentUser"])
  );

  const client = new Client(token || "");
  const notInRegister = !pathname.startsWith("/register");

  useQuery<AuthenticatedUserResponse, string>({
    queryKey: ["currentUser"],
    queryFn: async () => client.get(paths.user.current),
    onSuccess: (data) => {
      toast.dismiss();
      if (notInRegister && !user) {
        toast.success("Uspješno ste prijavljeni!");
        if (pathname === "/login") navigate("/");
      }
      setUser(data);
    },
    onError: () => {
      setToken(null);
      setUser(undefined);
    },
    enabled: notInRegister && !!token,
    refetchInterval: 1000 * 30,
  });
  const refreshMutation = useMutation<JwtAuthenticatedResponse, string>({
    mutationKey: ["refresh"],
    mutationFn: () => {
      if (notInRegister && !user && localStorage.getItem("token")) {
        toast.loading("Osvježavanje autentikacije...");
      }
      return client.post(paths.auth.refreshToken);
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    },
    onError: () => {
      toast.dismiss();
      if (localStorage.getItem("token") && notInRegister) {
        toast.error("Automatska prijava nije uspjela. Pokušajte se ponovo prijaviti.");
      }
      navigate("/login");
    },
  });

  React.useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  React.useEffect(() => {
    if (token === undefined) return;

    if (!token) {
      refreshMutation.mutate();
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = React.useMemo(() => {
    return { auth: { user, token: token as string | null }, setToken };
  }, [token, user, setToken]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return React.useContext(AppContext);
}
