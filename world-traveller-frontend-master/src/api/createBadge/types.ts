export type CityBadgeRequirement = {
  requiredLocations: number;
  locationType: string;
};

export type CreateCountryBadgeCommand = {
  badgeName: string;
  visitCapitalCity: boolean;
  requiredNumber: number;
  type: string;
  image: number[];
};

export type CreateCityBadgeCommand = {
  badgeName: string;
  requiredLocations: number;
  requirements: CityBadgeRequirement[];
  image: number[];
};
