import * as React from "react";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

import "./App.css";

import Router from "./Router";
import { ErrorResponse } from "./api/types";
import AuthInterceptor from "./components/AuthInterceptor/AuthInterceptor";
import ClientProvider from "./components/ClientProvider/ClientProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: async (err, query) => {
      const error = err as ErrorResponse;
      if (error.status === 401) {
        await queryClient.invalidateQueries(["currentUser"]);
        queryClient.invalidateQueries(query.queryKey);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (err) => {
      const error = err as ErrorResponse;
      if (error.status === 401) {
        queryClient.invalidateQueries(["currentUser"]);
      }
    },
  }),
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AuthInterceptor>
          <ClientProvider>
            <>
              <Toaster />
              <Router />
            </>
          </ClientProvider>
        </AuthInterceptor>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
