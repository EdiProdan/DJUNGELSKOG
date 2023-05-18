import { LocationTypes } from "../location/types";

export type TripResponse = {
  id: number;
  image: string;
  dateVisited: [number, number, number];
  transportationType: TransportationType;
  trafficRating: TrafficRating;
  solo: boolean;
  tripRating: TripRating;
  description: string;
  userId: number;
  username: string;
  location: LocationResponse;
  numLikes: number;
  isLiked: boolean;
};

type LocationResponse = {
  id: number;
  name: string;
  country: string;
  city: string;
  description: string;
  image: string;
  userId: number;
  username: string;
  numLikes: number;
};

export type TripCreateRequest = {
  image: number[];
  dateVisited: string;
  transportationType: TransportationType;
  trafficRating: TrafficRating;
  solo: boolean;
  tripRating: TripRating;
  description: string;
  locationIsSuggestion: boolean;
  locationId?: number;
  locationSuggestion?: LocationSuggestionRequest;
};

type LocationSuggestionRequest = {
  name: string;
  lng: number;
  lat: number;
  type: LocationTypes;
  cityName: string;
};

export enum TrafficRating {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  VERY_HIGH = "VERY_HIGH",
  EXTREMELY_HIGH = "EXTREMELY_HIGH",
}

export enum TransportationType {
  CAR = "CAR",
  TRAIN = "TRAIN",
  PLANE = "PLANE",
  BOAT = "BOAT",
  HELICOPTER = "HELICOPTER",
  ON_FOOT = "ON_FOOT",
  OTHER = "OTHER",
}

export enum TripRating {
  BAD = "BAD",
  OK = "OK",
  GOOD = "GOOD",
  VERY_GOOD = "VERY_GOOD",
  EXCELLENT = "EXCELLENT",
}
