import { WishlistEntryState } from "../../components/WishlistTabs/WishlistTabs";

export type WishlistEntryResponse = {
  id: number;
  location: {
    id: number;
    name: string;
  };
  state: WishlistEntryState;
  visitBefore: [number, number, number]; // [year,month,day]
};

export type WishlistEntryRequest = {
  visitBefore: string;
  locationId: number;
};
