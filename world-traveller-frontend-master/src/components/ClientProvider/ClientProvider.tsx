import React from "react";

import Client from "../../api/RestClient";
import { useAppContext } from "../AuthInterceptor/AuthInterceptor";

type ClientProviderProps = {
  children: React.ReactNode;
};

const ClientContext = React.createContext({
  client: Client.Default,
});

export default function ClientProvider({ children }: ClientProviderProps) {
  const { setToken, auth } = useAppContext();

  return (
    <ClientContext.Provider value={{ client: new Client(auth.token || "", setToken) }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  return React.useContext(ClientContext);
}
