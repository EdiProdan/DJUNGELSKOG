import React from "react";

import { ClockIcon, LocationMarkerIcon } from "@heroicons/react/outline";
import { useQuery } from "@tanstack/react-query";

import { WishlistEntryResponse } from "../../api/WishlistEntry/types";
import { FullLocationResponse } from "../../api/location/types";
import paths from "../../api/paths";
import Card from "../../components/Card/Card";
import * as ClientProvider from "../ClientProvider/ClientProvider";
import { DeleteButton } from "../DeleteButton/DeleteButton";
import Map from "../Map/Map";
import { WishlistEntryState } from "../WishlistTabs/WishlistTabs";

type WishListItemProps = {
  wishlistItem: WishlistEntryResponse;
  onDelete?: (itemId: number) => void;
  activeTab: WishlistEntryState;
};

//AiOutlineClockCircle

export const WishlistItem = ({ wishlistItem, onDelete, activeTab }: WishListItemProps) => {
  const { visitBefore } = wishlistItem;
  const { client } = ClientProvider.useClient();
  const date = new Date(visitBefore[0], visitBefore[1] - 1, visitBefore[2]);

  const { data, isLoading, isError } = useQuery<FullLocationResponse>({
    queryKey: ["location"],
    queryFn: () => client.get(paths.locations.get(wishlistItem.location.id)),
    enabled: !!client.token,
  });

  const handleDelete = React.useCallback(() => {
    if (onDelete) onDelete(wishlistItem.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishlistItem.id]);

  return (
    <Card className="flex-col bg-white h-full drop-shadow-xl sm:w-4/5 w-1/2">
      <div className="flex py-3">
        <LocationMarkerIcon className="ml-3 w-5 text-m" />
        <div className="text-m ml-3">{data?.name}</div>
        {activeTab === "ONGOING" && <DeleteButton className="ml-auto mr-3" onClick={handleDelete} />}
      </div>
      {!isLoading && !isError && (
        <Map
          className="h-40"
          features={[]}
          locations={[data]}
          dragging={false}
          locationLng={data?.lng}
          locationLat={data?.lat}
          zoom={15}
          scrollWheelZoom={false}
        />
      )}
      <div className="flex p-3">
        <ClockIcon className="w-5" />
        <span className="ml-3">{date.toLocaleDateString("hr-HR")}</span>
      </div>
    </Card>
  );
};
