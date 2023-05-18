import React from "react";

import { MailIcon } from "@heroicons/react/outline";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { UserProfilePictureResponse, UserProfileResponse } from "../../api/userProfile/types";
import { useClient } from "../../components/ClientProvider/ClientProvider";
import Card from "../Card/Card";
import ImageWrapper from "../Image/ImageWrapper";

type UserItemProps = {
  userProfile: UserProfileResponse;
};

export default function Useritem({ userProfile }: UserItemProps) {
  const { client } = useClient();

  const navigate = useNavigate();

  const { data: image } = useQuery<UserProfilePictureResponse, string>({
    queryKey: ["UserProfileImage"],
    queryFn: () => client.get(`api/userProfile/${userProfile.user.id}/picture`),
    enabled: !!client.token,
  });

  function handleClick() {
    navigate(`/userProfile/${userProfile.user.id}`);
  }

  return (
    <Card className="flex flex-row items-center gap-4 bg-white px-5 ">
      <button className="flex flex-row flex-grow gap-4 py-5" onClick={handleClick}>
        <ImageWrapper className="w-16 h-16" alt="" base64Encoded={true} imageURL={image?.image} rounded />
        <div className="flex flex-col justify-center h-full text-left">
          <p className="text-2xl">{`${userProfile.user.name} ${userProfile.user.surname}`}</p>
          <p className="text-sm">{`@${userProfile.user.username}`}</p>
        </div>
      </button>
      <label className="text-xl sm:flex sm:visible invisible sm:flex-row gap-2">
        {userProfile.user.email}
        <MailIcon
          className="text-base w-8 h-8 cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText(userProfile.user.email).then(() => {
              toast.success("Email copied to clipboard!");
            });
          }}
        />
      </label>
    </Card>
  );
}
