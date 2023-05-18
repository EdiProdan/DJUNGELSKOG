import React from "react";

import { CameraIcon, PencilAltIcon } from "@heroicons/react/outline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { useCurrentUser } from "../../Router";
import paths from "../../api/paths";
import { UserProfilePictureResponse, UserProfileResponse } from "../../api/userProfile/types";
import RecentBadges from "../../components/Badge/RecentBadges";
import Card from "../../components/Card/Card";
import { useClient } from "../../components/ClientProvider/ClientProvider";
import ImageWrapper from "../../components/Image/ImageWrapper";
import Trips from "../../components/Trips/ProfileTrips";
import FriendsModal from "../Friends/FriendsModal";

export default function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { client } = useClient();
  const currentUser = useCurrentUser();

  React.useEffect(() => {
    if (id) queryClient.invalidateQueries(["UserProfile"]);
  }, [id, queryClient]);

  const { data, isLoading, isError } = useQuery<UserProfileResponse, string>({
    queryKey: ["UserProfile", id],
    queryFn: () => client.get(paths.userProfile.get(id)),
    enabled: !!client.token,
  });

  const {
    data: sentRequests,
    isLoading: loadingRequests,
    isError: errorRequests,
  } = useQuery<number[], string>({
    queryKey: ["sentRequests", id],
    queryFn: () => client.get(paths.userProfile.sentRequests),
    enabled: !!client.token,
  });

  const {
    data: image,
    isLoading: loading,
    isError: error,
  } = useQuery<UserProfilePictureResponse, string>({
    queryKey: ["UserProfileImage", id],
    queryFn: () => client.get(paths.userProfile.getPicture(id ? id : currentUser.id)),
    enabled: !!client.token,
  });

  const { mutate: addFriendMutate } = useMutation({
    mutationKey: ["addFriend", id],
    mutationFn: () => client.post(paths.userProfile.addFriend(id ? id : "")),
  });

  if (isLoading || loading || loadingRequests) return <span>Loading...</span>;
  if (isError || error || errorRequests) return <span>Error</span>;

  const showAddFriend = () => {
    let flag = true;
    if (currentUser.id === Number(id) || !id) return false;
    if (sentRequests.length === 0) return true;
    sentRequests.forEach((request) => {
      if (request == Number(id)) flag = false;
    });
    return flag;
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-4">
      <Card className="ml-auto mr-auto mt-10 w-2/3 h-1/5 p-4">
        <div className="content flex">
          <ImageWrapper className="w-32 h-32" alt="" base64Encoded={true} imageURL={image.image} rounded />
          <span className="flex flex-col space-y-4 mt-4 ml-5">
            <span className="flex flex-col">
              <span className="text-xl font-bold">{data.user.name}</span>
              <span className="text-gray-500 hover:text-bold">{"@" + data.user.username}</span>
            </span>
            <span>
              <span>Prijatelja:</span>
              <FriendsModal friendsList={data.friends} />
              {showAddFriend() && (
                <button
                  className="ml-2 rounded-md bg-base px-4 py-2 text-sm font-medium text-white hover:bg-rose-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                  onClick={() => {
                    addFriendMutate();
                    queryClient.invalidateQueries(["UserProfile", id]);
                    sentRequests.push(Number(id));
                  }}
                >
                  Dodaj prijatelja
                </button>
              )}
            </span>
          </span>
          {(currentUser.id === Number(id) || !id) && (
            <button
              className="ml-auto bg-base hover:bg-rose-400 text-white rounded h-10 w-10"
              onClick={() => navigate("/userProfile/edit")}
            >
              <PencilAltIcon className="h-6 w-6 m-auto" />
            </button>
          )}
        </div>
      </Card>

      <RecentBadges className="w-2/3" />

      {((data.public && currentUser.id !== data.userId) || currentUser.id === data.userId) && (
        <>
          <div className="w-2/3 border-b-2 border-gray-300 flex my-7">
            <div className="m-auto flex flex-row border-b-4 border-blue-500 p-2">
              <CameraIcon className="h-6 w-6 mr-2" />
              <p>Putovanja</p>
            </div>
          </div>
          <Trips />
        </>
      )}
    </div>
  );
}
