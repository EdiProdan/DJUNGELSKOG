export enum LocationTypes {
  MUSEUM = "MUSEUM",
  CHURCH = "CHURCH",
  STADIUM = "STADIUM",
  OTHER = "OTHER",
}

export type LocationCoordinatesResponse = {
  id: number;
  lng: number;
  lat: number;
  name: string;
};

export type LocationResponse = {
  id: number;
  name: string;
};

export type FullLocationResponse = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  cityId: number;
  cityName: string;
  countryCode: string;
  countryName: string;
};

export type CityRequest = {
  name: string;
};
