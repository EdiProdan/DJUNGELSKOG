import { LocationTypes } from "../../api/location/types";

export type FullLocationResponse = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: LocationTypes;
  cityId: number;
  cityName: string;
  isCapitalCity: boolean;
  countryCode: string;
  countryName: string;
  suggestedBy: string;
};

export type CityResponse = {
  id: number;
  name: string;
  country: {
    code: string;
    geoData: string;
  };
};
