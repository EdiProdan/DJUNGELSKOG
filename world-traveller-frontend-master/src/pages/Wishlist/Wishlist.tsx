import React from "react";

import { SearchIcon } from "@heroicons/react/outline";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { WishlistEntryResponse } from "../../api/WishlistEntry/types";
import paths from "../../api/paths";
import ActionButton from "../../components/ActionButton/ActionButton";
import { useClient } from "../../components/ClientProvider/ClientProvider";
import SearchBar from "../../components/SearchBar/SearchBar";
import { WishlistItem } from "../../components/WishlistItem/WishlistItem";
import { WishlistEntryState, WishlistEntryStateIndex, WishlistTabs } from "../../components/WishlistTabs/WishlistTabs";

export default function Wishlist() {
  const navigate = useNavigate();
  const { client } = useClient();
  const queryClient = useQueryClient();

  const [search, setSearch] = React.useState("");
  const [allWishlists, setAllWishlists] = React.useState<WishlistEntryResponse[]>([]);
  const [filteredWishlists, setFilteredWIshlists] = React.useState<WishlistEntryResponse[]>([]);
  const [activeTab, setActiveTab] = React.useState<WishlistEntryState>(WishlistEntryState.ONGOING);

  useQuery({
    queryKey: ["wishlist"],
    queryFn: () => client.get(paths.wishlistEntry.get),
    enabled: !!client.token,
    onSuccess: (res) => setAllWishlists(res as WishlistEntryResponse[]),
  });

  React.useEffect(() => {
    const filtered = allWishlists.filter(
      (wishlist) => wishlist.state === activeTab && wishlist.location.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredWIshlists(filtered);
  }, [allWishlists, activeTab, search]);

  const handleOnSearchChange = React.useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleTabChange = React.useCallback((index: WishlistEntryStateIndex) => {
    switch (index) {
      case WishlistEntryStateIndex.ONGOING:
        setActiveTab(WishlistEntryState.ONGOING);
        break;
      case WishlistEntryStateIndex.COMPLETED:
        setActiveTab(WishlistEntryState.COMPLETED);
        break;
      case WishlistEntryStateIndex.EXPIRED:
        setActiveTab(WishlistEntryState.EXPIRED);
        break;
      default:
        setActiveTab(WishlistEntryState.ONGOING);
        break;
    }
  }, []);

  const handleDeleteItem = async (itemId: number) => {
    await client.delete(paths.wishlistEntry.delete(itemId));
    queryClient.invalidateQueries(["wishlist"]);
  };

  return (
    <div className="mx-20 flex flex-col">
      <div className="flex justify-center">
        <div className="flex flex-row items-center gap-4 bg-base p-6 w-96 rounded-b-2xl">
          <SearchIcon className="w-8 h-8 text-white" />
          <SearchBar
            placeholder="Pretraži listu želja..."
            onChange={(val) => handleOnSearchChange(val)}
            className="flex-grow"
          />
        </div>
      </div>
      <WishlistTabs onChange={handleTabChange} />
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
        {filteredWishlists.map((data, idx) => (
          <WishlistItem key={idx} wishlistItem={data} onDelete={handleDeleteItem} activeTab={activeTab} />
        ))}
      </div>
      <div className="absolute bottom-10 sm:bottom-32 lg:bottom-10 right-10">
        <ActionButton className="mt-10" text="Nova želja" onClick={() => navigate("/wishlist/create")} />
      </div>
    </div>
  );
}
